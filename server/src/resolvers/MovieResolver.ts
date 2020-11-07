import { Movie } from "../enitities/Movie";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../enitities/middleware/isAUth";

//Resolver for queries med graphql
@InputType()
class MovieInput {
    @Field()
    title: string;
    @Field()
    description: string;
    @Field()
    poster: string;
    @Field()
    reason: string;
    @Field()
    score: number;
}

@Resolver()
export class MovieResolver {
    @Query(() => [Movie])
    getMovies(): Promise<Movie[]> {
        return Movie.find();
    }

    @Query(() => Movie)
    getOne(@Arg("id") id: number): Promise<Movie | undefined> {
        return Movie.findOne(id);
    }

    @Mutation(() => Movie)
    @UseMiddleware(isAuth)
    async addMovie(
        @Arg("input") input: MovieInput,
        @Ctx() { req }: MyContext
    ): Promise<Movie> {
        return Movie.create({
            ...input,
            creatorId: req.session?.userId,
        }).save();
    }

    @Mutation(() => Movie, { nullable: true })
    async updateMovie(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string
    ): Promise<Movie | undefined> {
        const movie = await Movie.findOne(id);
        if (!movie) return undefined;
        if (typeof movie !== "undefined") {
            await Movie.update({ id }, { title });
        }
        return movie;
    }

    @Mutation(() => Boolean)
    async deleteMovie(@Arg("id") id: number): Promise<boolean> {
        try {
            await Movie.delete(id);
            return true;
        } catch {
            return false;
        }
    }
}
