import { Movie } from "../enitities/Movie";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../enitities/middleware/isAUth";
import { getConnection } from "typeorm";
import { User } from "../enitities/User";

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

@Resolver(Movie)
export class MovieResolver {
    @FieldResolver(() => User)
    creator(@Root() movie: Movie) {
        return User.findOne(movie.creatorId);
    }

    @Query(() => PaginatedMovies)
    async getMovies(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(10, limit);
        const realLimitPlusOne = Math.min(10, limit) + 1;
        // const qb = getConnection()
        //     .getRepository(Movie)
        //     .createQueryBuilder("movie")
        //     .innerJoinAndSelect("movie.creator", "u", 'u.id = p."creatorid"')
        //     .orderBy('movie."createdAt"', "DESC") // holde A uppercase, sorterer etter nyeste
        //     .take(realLimitPlusOne);
        // if (cursor) {
        //     qb.where('movie."createdAt" < :cursor', {
        //         cursor: new Date(parseInt(cursor)),
        //     });
        // }
        const replacements: any[] = [realLimitPlusOne];
        // if (req.session?.userId) replacements.push(req.session.userId);
        let cursorIdx = 3;
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
            cursorIdx = replacements.length;
        }
        console.log(replacements);

        const movies = await getConnection().query(
            `
          select * from movie
          ${cursor ? `where "createdAt" < $${cursorIdx}` : ""}
          order by "createdAt" DESC
          limit $1
          `,
            replacements
        );
        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => Movie, { nullable: true })
    // @UseMiddleware(isAuth)
    async getMovie(
        @Arg("id", () => Int!) id: number
    ): Promise<Movie | undefined> {
        return Movie.findOne(id);
    }

    @Mutation(() => Movie)
    // @UseMiddleware(isAuth)
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
    // @UseMiddleware(isAuth)
    async updateMovie(
        @Arg("id", () => Int) id: number,
        @Arg("input") input: MovieInput,
        @Ctx() { req }: MyContext
    ): Promise<Movie | undefined> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Movie)
            .set(input)
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session!.userId,
            })
            .returning("*")
            .execute();

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth)
    async deleteMovie(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        try {
            await Movie.delete({ id, creatorId: req.session!.userId });
            return true;
        } catch {
            return false;
        }
    }
}
