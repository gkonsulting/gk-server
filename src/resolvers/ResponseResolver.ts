import {
    Arg,
    Field,
    Int,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { isAuth } from "../enitities/middleware/isAUth";
import { Response } from "../enitities/Response";

@ObjectType()
class Responses {
    @Field(() => Int)
    accept: number;
    @Field(() => Int)
    decline: number;
}

@Resolver(Response)
export class ResponseResolver {
    @Query(() => Responses)
    @UseMiddleware(isAuth)
    async getResponses(
        @Arg("eventId", () => Int) eventId: number
    ): Promise<Responses> {
        const [, count1] = await Response.findAndCount({
            where: [{ eventId: eventId, value: 1 }],
        });
        const [, count2] = await Response.findAndCount({
            where: [{ eventId: eventId, value: -1 }],
        });
        return { accept: count1, decline: count2 };
    }
    @Query(() => Int)
    @UseMiddleware(isAuth)
    async getAllResponses(
        @Arg("eventId", () => Int) eventId: number
    ): Promise<number> {
        const [, totalCount] = await Response.findAndCount({
            where: [{ eventId: eventId }],
        });
        return totalCount;
    }
}
