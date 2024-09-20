"use client";
import { HeaderLogo } from "@/components/header_logo"
import { Navigation } from "@/components/navigation"
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "@/components/welcome";
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';

export const Header = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null; // Render nothing until mounted
    }
    return (
        <header className={`px-4 py-8 lg:px-12 pb-12 transition-colors ${
            theme === 'dark' 
            ? 'bg-gradient-to-b from-[#232931] to-[#1c1f26]' 
            : 'bg-gradient-to-b from-blue-700 to-blue-400'
        }`}>
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-11">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo/>
                        <Navigation/>
                    </div>
                    <ClerkLoaded>
                    <UserButton afterSignOutUrl="/"></UserButton>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-3 animate-ping text-slate-200">
                        </Loader2>
                    </ClerkLoading>
                </div>
                <WelcomeMsg/>
            </div>
        </header>
    );
};