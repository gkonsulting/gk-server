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
import { MyContext } from "../types";
import { isAuth } from "../enitities/middleware/isAUth";
import { getConnection } from "typeorm";
import { User } from "../enitities/User";
import { Vote } from "../enitities/Vote";
import { Star } from "../enitities/Star";

//Resolver for queries med graphql
@InputType()
class MovieInput {
    @Field()
    title: string;
    @Field()
    releasedAt: string;
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
    creator(@Root() movie: Movie, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(movie.creatorId);
    }

    @FieldResolver(() => Int, { nullable: true })
    async voteStatus(
        @Root() movie: Movie,
        @Ctx() { voteLoader, req }: MyContext
    ) {
        if (!req.session?.userId) {
            return null;
        }

        const vote = await voteLoader.load({
            movieId: movie.id,
            userId: req.session.userId,
        });

        return vote ? vote.value : null;
    }

    @FieldResolver(() => Int, { nullable: true })
    async starStatus(
        @Root() movie: Movie,
        @Ctx() { starLoader, req }: MyContext
    ) {
        if (!req.session?.userId) {
            return null;
        }

        const star = await starLoader.load({
            movieId: movie.id,
            userId: req.session.userId,
        });

        return star ? star.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg("movieId", () => Int) movieId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const isVote = value !== -1;
        const realValue = isVote ? 1 : -1;
        const { userId } = req.session!;

        const vote = await Vote.findOne({ where: { movieId, userId } });

        // the user has voted on the movie before
        // and they are changing their vote
        if (vote && vote.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                    update vote
                    set value = $1
                    where "movieId" = $2 and "userId" = $3
                        `,
                    [realValue, movieId, userId]
                );

                await tm.query(
                    `
                    update movie
                    set points = points + $1
                    where id = $2
                    `,
                    [2 * realValue, movieId]
                );
            });
        } else if (!vote) {
            // has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                insert into vote ("userId", "movieId", value)
                values ($1, $2, $3)
                    `,
                    [userId, movieId, realValue]
                );

                await tm.query(
                    `
                update movie
                set points = points + $1
                where id = $2
                `,
                    [realValue, movieId]
                );

                await tm.query(
                    `
                    update movie
                    set "userVotes" = "userVotes" + $1
                    where id = $2
                `,
                    [1, movieId]
                );
            });
        }
        return true;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async setStars(
        @Arg("movieId", () => Int) movieId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        // const isStar = value !== -1;
        const realValue = value;
        const { userId } = req.session!;

        const star = await Star.findOne({ where: { movieId, userId } });

        // the user has voted on the movie before
        // and they are changing their vote
        if (star && star.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                    update star
                    set value = $1
                    where "movieId" = $2 and "userId" = $3
                        `,
                    [realValue, movieId, userId]
                );

                await tm.query(
                    `
                    update movie
                    set "totalStars" = "totalStars" + $1
                    where id = $2
                    `,
                    [realValue - star.value, movieId]
                );
            });
        } else if (!star) {
            // has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                insert into star ("userId", "movieId", value)
                values ($1, $2, $3)
                    `,
                    [userId, movieId, realValue]
                );

                await tm.query(
                    `
                update movie
                set "totalStars" = "totalStars" + $1
                where id = $2
                `,
                    [realValue, movieId]
                );
                await tm.query(
                    `
                update movie
                set "userStars" = "userStars" + $1
                where id = $2
                `,
                    [1, movieId]
                );
            });
        }
        return true;
    }

    @Query(() => PaginatedMovies)
    @UseMiddleware(isAuth)
    async getMovies(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const movies = await getConnection().query(
            `
          select m.*
          from movie m
          ${
              cursor
                  ? `where m."createdAt" < $2 and m."seen" = false`
                  : `where m."seen" = false`
          }
          order by m."createdAt" DESC
          limit $1
          `,
            replacements
        );

        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => PaginatedMovies)
    @UseMiddleware(isAuth)
    async getMoviesWatched(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const movies = await getConnection().query(
            `
          select m.*
          from movie m
          ${
              cursor
                  ? `where m."seen" = true and m."createdAt" < $2 `
                  : `where m."seen" = true`
          }
          order by m."createdAt" DESC
          limit $1
          `,
            replacements
        );

        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => PaginatedMovies)
    @UseMiddleware(isAuth)
    async getMyMovies(
        @Arg("limit", () => Int) limit: number,
        @Arg("creatorId", () => Int) creatorId: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];
        replacements.push(creatorId);

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const movies = await getConnection().query(
            `
          select m.*
          from movie m
          ${
              cursor
                  ? `where m."creatorId" = $2 and m."createdAt" < $3`
                  : `where m."creatorId" = $2 `
          }
          order by m."createdAt" DESC
          limit $1
          `,
            replacements
        );

        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => PaginatedMovies)
    @UseMiddleware(isAuth)
    async getPopularMovies(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => Int, { nullable: true }) cursor: number | null
    ): Promise<PaginatedMovies> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];

        if (cursor) {
            replacements.push(cursor);
        }

        const movies = await getConnection().query(
            `
          select m.*
          from movie m
          order by m."seen" ASC,
          "points" DESC,
          "createdAt" DESC
          limit $1
          ${cursor ? `offset $2` : ""}
          `,
            replacements
        );

        return {
            movies: movies.slice(0, realLimit),
            hasMore: movies.length === realLimitPlusOne,
        };
    }

    @Query(() => Movie, { nullable: true })
    @UseMiddleware(isAuth)
    async getMovie(
        @Arg("id", () => Int!) id: number
    ): Promise<Movie | undefined> {
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
    @UseMiddleware(isAuth)
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

        console.log(result);
        

        return result.raw[0];
    }

    @Mutation(() => Movie, { nullable: true })
    @UseMiddleware(isAuth)
    async updateSeen(
        @Arg("id", () => Int) id: number,
        @Arg("seen") input: boolean,
        @Ctx() { req }: MyContext
    ): Promise<Movie | undefined> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Movie)
            .set({ seen: input })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session!.userId,
            })
            .returning("*")
            .execute();

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
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
