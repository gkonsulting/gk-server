import { Movie } from "../enitities/Movie";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";

//Resolver for queries med graphql
@Resolver()
export class MovieResolver {
    @Query(() => [Movie])
    getMovies(@Ctx() ctx: MyContext): Promise<Movie[]> {
        return ctx.em.find(Movie, {});
    }

    @Query(() => Movie)
    getOne(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<Movie | null> {
        return em.findOne(Movie, { id });
    }

    @Mutation(() => Movie)
    async createMovie(
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Movie> {
        const newMovie = em.create(Movie, { title: title });
        console.log(newMovie);
        await em.persistAndFlush(newMovie);
        return newMovie;
    }

    @Mutation(() => Movie, { nullable: true })
    async updateMovie(
        @Arg("id") id: number,
        @Arg("title") newTitle: string,
        @Ctx() { em }: MyContext
    ): Promise<Movie | null> {
        const movie = await em.findOne(Movie, { id });
        if (!movie) return null;
        if (typeof movie !== "undefined") {
            movie.title = newTitle;
            await em.persistAndFlush(movie);
        }
        return movie;
    }

    @Mutation(() => Boolean)
    async deleteMovie(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Movie, { id });
            return true;
        } catch {
            return false;
        }
    }
}
