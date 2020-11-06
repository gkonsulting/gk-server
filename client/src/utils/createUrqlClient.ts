import { dedupExchange, fetchExchange, ssrExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
    LoginMutation,
    MeQuery,
    MeDocument,
    LogoutMutation,
    RegisterMutation,
} from "../generated/graphql";
import { bettUpdateQuery } from "./bettUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
    url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        dedupExchange,
        cacheExchange({
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
                                if (result.registerUser.errors) return query;
                                else
                                    return {
                                        me: result.registerUser.user,
                                    };
                            }
                        );
                    },
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
});
