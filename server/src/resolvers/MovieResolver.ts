import { Movie } from "../enitities/Movie";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../enitities/middleware/isAUth";
import { getConnection } from "typeorm";

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
    rating: string;
}

@ObjectType()
class PaginatedMovies {
    @Field(() => [Movie])
    movies: Movie[];
    @Field()
    hasMore: boolean;
}

@Resolver()
export class MovieResolver {
    @Query(() => PaginatedMovies)
    async getMovies(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(10, limit);
        const realLimitPlusOne = Math.min(10, limit) + 1;
        const qb = getConnection()
            .getRepository(Movie)
            .createQueryBuilder("user")
            .orderBy('"createdAt"', "DESC") // holde A uppercase, sorterer etter nyeste
            .take(realLimitPlusOne);

        if (cursor) {
            qb.where('"createdAt" < :cursor', {
                cursor: new Date(parseInt(cursor)),
            });
        }
        const movies = await qb.getMany();
        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => Movie)
    async getOne(@Arg("id") id: number): Promise<Movie | undefined> {
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
