import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const userAuth = () => {
    const { data, loading } = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !data?.me)
            router.replace("/Login?next=" + router.pathname);
            console.log(router.pathname);
            
    }, [loading, data, router]);
};
