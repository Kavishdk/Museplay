"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export function Redirect(){
    const session = useSession();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && session.data?.user){
            router.push("/dashboard");
        }
    }, [session, router, isMounted]);

    if (!isMounted) {
        return null;
    }

    return null;
}