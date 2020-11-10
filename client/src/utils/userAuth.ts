import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const userAuth = () => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!fetching && !data?.me)
            router.replace("/Login?next=" + router.pathname);
            console.log(router.pathname);
            
    }, [fetching, data, router]);
};
