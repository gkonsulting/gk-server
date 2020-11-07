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
import { COOKIE_NAME, RESET_PASSWORD_PREFIX } from "../constants";
import { UserCredentials } from "../utils/UserCredentials";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmails";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

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
        @Ctx() { req, redis }: MyContext
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
        const id = parseInt(userId);
        const user = await User.findOne(id);
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
        await User.update(
            { id: user.id },
            {
                password: await argon2.hash(newPasword),
            }
        );
        await redis.del(key);
        req.session!.userId = user.id;
        return { user };
    }

    @Mutation(() => Boolean)
    async resetPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email } }); // hvis man søker etter kolonne som ikke er PK
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
    me(@Ctx() { req }: MyContext) {
        if (!req.session!.userId) return null;
        return User.findOne(req.session!.userId);
    }

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("options") options: UserCredentials,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) return { errors };
        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    email: options.email,
                    username: options.username,
                    password: hashedPassword,
                })
                .returning("*")
                .execute();
            user = result.raw[0];
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
        req.session!.userId = user.id;
        return user;
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes("@")
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } }
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
