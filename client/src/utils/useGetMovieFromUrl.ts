import { useGetMovieQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetMovieFromUrl = () => {
    const intId = useGetIntId();    
    return useGetMovieQuery({
        skip: intId === -1,
        variables: {
            id: intId,
        },
    });
};
