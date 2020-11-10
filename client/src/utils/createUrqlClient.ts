import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import {
    dedupExchange,
    Exchange,
    fetchExchange,
    stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
    DeleteMovieMutationVariables,
    LoginMutation,
    LogoutMutation,
    MeDocument,
    MeQuery,
    RegisterMutation,
} from "../generated/graphql";
import { bettUpdateQuery } from "./bettUpdateQuery";
import Router from "next/router";
import { isServer } from "./isServer";

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
    return pipe(
        forward(ops$),
        tap(({ error }) => {
            // If the OperationResult has an error send a request to sentry
            if (error?.message.includes("Not authenticated")) {
                Router.replace("/Login");
            }
        })
    );
};

export interface PaginationParams {
    offsetArgument?: string;
    limitArgument?: string;
}

export const cursorPagination = (): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info;

        const allFields = cache.inspectFields(entityKey);
        const fieldInfos = allFields.filter(
            (info) => info.fieldName === fieldName
        );
        const size = fieldInfos.length;
        if (size === 0) {
            return undefined;
        }
        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
        const isInCache = cache.resolve(
            cache.resolveFieldByKey(entityKey, fieldKey) as string,
            "movies"
        );
        info.partial = !isInCache;
        const results: string[] = [];
        let hasMore = true;
        fieldInfos.forEach((field) => {
            const key = cache.resolveFieldByKey(
                entityKey,
                field.fieldKey
            ) as string;
            const data = cache.resolve(key, "movies") as string[];
            const _hasMore = cache.resolve(key, "hasMore");
            if (!_hasMore) hasMore = _hasMore as boolean;
            results.push(...data);
        });
        return {
            __typename: "PaginatedMovies",
            hasMore,
            movies: results,
        };
        // const visited = new Set();
        // let result: NullArray<string> = [];
        // let prevOffset: number | null = null;

        // for (let i = 0; i < size; i++) {
        //     const { fieldKey, arguments: args } = fieldInfos[i];
        //     if (args === null || !compareArgs(fieldArgs, args)) {
        //         continue;
        //     }

        //     const links = cache.resolveFieldByKey(
        //         entityKey,
        //         fieldKey
        //     ) as string[];
        //     const currentOffset = args[cursorArgument];

        //     if (
        //         links === null ||
        //         links.length === 0 ||
        //         typeof currentOffset !== "number"
        //     ) {
        //         continue;
        //     }

        //     if (!prevOffset || currentOffset > prevOffset) {
        //         for (let j = 0; j < links.length; j++) {
        //             const link = links[j];
        //             if (visited.has(link)) continue;
        //             result.push(link);
        //             visited.add(link);
        //         }
        //     } else {
        //         const tempResult: NullArray<string> = [];
        //         for (let j = 0; j < links.length; j++) {
        //             const link = links[j];
        //             if (visited.has(link)) continue;
        //             tempResult.push(link);
        //             visited.add(link);
        //         }
        //         result = [...tempResult, ...result];
        //     }

        //     prevOffset = currentOffset;
        // }

        // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
        // if (hasCurrentPage) {
        //     return result;
        // } else if (!(info as any).store.schema) {
        //     return undefined;
        // } else {
        //     info.partial = true;
        //     return result;
        // }
    };
};

function invalidateAllMovies(cache: Cache) {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter(
        (info) => info.fieldName === "getMovies"
    );
    fieldInfos.forEach((movie) => {
        cache.invalidate("Query", "getMovies", movie.arguments || {});
    });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
    let cookie = "";
    if (isServer()) cookie = ctx?.req?.headers.cookie;
    return {
        url: process.env.NEXT_PUBLIC_API_URL as string,
        fetchOptions: {
            credentials: "include" as const,
        },
        exchanges: [
            dedupExchange,
            cacheExchange({
                keys: {
                    PaginatedMovies: () => null,
                },
                resolvers: {
                    Query: {
                        getMovies: cursorPagination(),
                    },
                },
                updates: {
                    Mutation: {
                        login: (_result, args, cache, info) => {
                            bettUpdateQuery<LoginMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.login.errors) return query;
                                    else
                                        return {
                                            me: result.login.user,
                                        };
                                }
                            );
                        },
                        logout: (_result, args, cache, info) => {
                            bettUpdateQuery<LogoutMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                () => ({ me: null })
                            );
                        },
                        registerUser: (_result, args, cache, info) => {
                            bettUpdateQuery<RegisterMutation, MeQuery>(
                                cache,
                                { query: MeDocument },
                                _result,
                                (result, query) => {
                                    if (result.registerUser.errors)
                                        return query;
                                    else
                                        return {
                                            me: result.registerUser.user,
                                        };
                                }
                            );
                        },
                        addMovie: (_result, args, cache, info) => {
                            invalidateAllMovies(cache);
                        },
                        deleteMovie: (_result, args, cache, info) => {
                            cache.invalidate({
                                __typename: "Movie",
                                id: (args as DeleteMovieMutationVariables).id,
                            });
                        },
                    },
                },
            }),
            errorExchange,
            ssrExchange,
            fetchExchange,
        ],
    };
};
