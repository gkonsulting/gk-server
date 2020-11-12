import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedMovies } from "../generated/graphql";
import { NextPageContext } from "next";

const createClient = (ctx: NextPageContext) =>
    new ApolloClient({
        uri: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        headers: {
            cookie:
                (typeof window === "undefined"
                    ? ctx?.req?.headers.cookie
                    : undefined) || "",
        },
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        getMovies: {
                            keyArgs: [],
                            merge(
                                existing: PaginatedMovies | undefined,
                                incoming: PaginatedMovies
                            ): PaginatedMovies {
                                return {
                                    ...incoming,
                                    movies: [
                                        ...(existing?.movies || []),
                                        ...incoming.movies,
                                    ],
                                };
                            },
                        },
                    },
                },
            },
        }),
    });

export const withApollo = createWithApollo(createClient);
