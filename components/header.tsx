import { HeaderLogo } from "@/components/header_logo"
import { Navigation } from "@/components/navigation"
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "@/components/welcome";
import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSwitch } from "@/app/switch-context";
import { useRouter } from 'next/navigation';
import { useGetLockingInData } from "@/features/lockingin/use-get-lockingin";
import { Component as ChartComponent } from "@/components/lockedin-chart";
import { NutritionRadialChart } from "@/components/calorie-chart";
import MuscleGroupCharts from "@/components/muscle-group-chart";
import TodayHabits from '@/components/habits-chart';
import UncheckedTasks from '@/components/pending-tasks';

export const Header = () => {
    const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null; // Render nothing until mounted
    }
    return (
        <header className={`px-4 py-5 lg:px-12 pb-6 transition-colors ${
            theme === 'dark' 
            ? 'bg-gradient-to-b from-[#232931] to-[#1c1f26]' 
            : 'bg-gradient-to-b from-blue-700 to-blue-400'
        }`}>
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-8">
                    <div className="flex items-center lg:gap-x-10">
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