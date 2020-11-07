import { User } from "../enitities/User";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { MyContext } from "../types";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME, RESET_PASSWORD_PREFIX } from "../constants";
import { UserCredentials } from "../utils/UserCredentials";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmails";
import { v4 } from "uuid";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
    @Field(() => User, { nullable: true })
    user?: User;
}

//Resolver for queries med graphql
@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPassword") newPasword: string,
        @Ctx() { em, req, redis }: MyContext
    ): Promise<UserResponse> {
        if (newPasword.length < 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Password must be at least three characters",
                    },
                ],
            };
        }
        const key = RESET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "Token expired",
                    },
                ],
            };
        }
        const user = await em.findOne(User, { id: parseInt(userId) });
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User no longer exists",
                    },
                ],
            };
        }
        user.password = await argon2.hash(newPasword);
        await em.persistAndFlush(user);
        await redis.del(key);
        req.session!.userId = userId;
        return { user };
    }

    @Mutation(() => Boolean)
    async resetPassword(
        @Arg("email") email: string,
        @Ctx() { em, redis }: MyContext
    ) {
        const user = await em.findOne(User, { email });
        if (!user) return true;
        const token = v4();
        await redis.set(
            RESET_PASSWORD_PREFIX + token,
            user.id,
            "ex",
            1000 * 60 * 60 * 24 * 3
        ); // 3 dager
        await sendEmail(
            email,
            `<a href="http://localhost:3000/Reset-password/${token}">Reset password</a>`
        );
        return true;
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { em, req }: MyContext) {
        if (!req.session!.userId) return null;
        const user = await em.findOne(User, { id: req.session!.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("options") options: UserCredentials,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) return { errors };
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const res = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    email: options.email,
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning("*");
            user = res[0];
        } catch (error) {
            if (error.detail.includes("already exists")) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already exists",
                        },
                    ],
                };
            }
        }
        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(
            User,
            usernameOrEmail.includes("@")
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail }
        );
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "Wrong credentials.",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Wrong credentials",
                    },
                ],
            };
        }
        // lagre userid session
        // setter cookie på brukeren
        // holder dem logget inn
        req.session!.userId = user.id; // ! kan være undefined
        return { user };
    }

    // Fjerner session i redis, lager promise som venter på å fjerne session ved bruk av callback og fjerner cookie
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session?.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }
}
