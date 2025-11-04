"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { Music } from "lucide-react"

export function Appbar() {
    const session = useSession();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center h-14 px-4 bg-gray-900">
                <div className="flex items-center justify-center">
                    <Music className="h-6 w-6 text-purple-400" />
                    <span className="ml-2 text-2xl font-bold text-purple-400">MusePlay</span>
                </div>
                <nav className="flex items-center gap-4 sm:gap-6 ml-auto">
                    <span className="text-sm font-medium text-gray-300">Loading...</span>
                </nav>
            </div>
        );
    }

    return (
        <div className="flex items-center h-14 px-4 bg-gray-900">
            <Link className="flex items-center justify-center" href="#">
                <Music className="h-6 w-6 text-purple-400" />
                <span className="ml-2 text-2xl font-bold text-purple-400">MusePlay</span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 ml-auto">
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#features">
                    Features
                </Link>
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#how-it-works">
                    How It Works
                </Link>
                <Link className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors" href="#contact">
                    Contact
                </Link>
                <div>  
                    {session.data?.user ? (
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signOut()}>
                            Logout
                        </Button>
                    ) : (
                        <div className="flex space-x-2">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signIn("google")}>
                                Sign in with Google
                            </Button>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => signIn("email")}>
                                Sign in with Email
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}