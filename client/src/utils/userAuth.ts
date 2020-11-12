import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const userAuth = (id?: number) => {
    const { data, loading } = useMeQuery();
    const router = useRouter();    

    useEffect(() => {
        if (!loading && !data?.me && id) {
            router.replace("/Login?next=" + router.pathname.slice(0, -4) + id);
        } else if (!loading && !data?.me) {
            router.replace("/Login?next=" + router.pathname);
        }
    }, [loading, data, router]);
};
