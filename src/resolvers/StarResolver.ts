import { isAuth } from "../enitities/middleware/isAUth";
import { Star } from "../enitities/Star";
import { Resolver, Query, UseMiddleware, Arg, Int } from "type-graphql";

@Resolver()
export class StarResolver {
    @Query(() => Star)
    @UseMiddleware(isAuth)
    async getStar(
        @Arg("movieId", () => Int) movieId: number,
        @Arg("userId", () => Int) userId: number
    ): Promise<Star | undefined> {
        return Star.findOne({ where: { movieId, userId } });
    }
}
