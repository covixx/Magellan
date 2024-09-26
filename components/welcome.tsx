import { useUser } from "@clerk/nextjs";
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';
import { useSwitch } from "@/app/switch-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export const WelcomeMsg = () => {
    const router = useRouter();
  const { isSwitchOn, toggleSwitch } = useSwitch();
    const { user, isLoaded } = useUser();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
const handleSwitchChange = () => {
    toggleSwitch();
    if (!isSwitchOn) {
      router.push('/lockingin');
    }
  };
    return (
        <div className="gap-y-4 ">
            <div className="flex items-center gap-2">
                <h2 className="font-semibold text-2xl">
                    Welcome Back   
                </h2>
               
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-0 hover:bg-transparent focus:ring-0"
                >
                    <Image 
                        src="/Batman.png" 
                        alt="Theme Toggle" 
                        height={32} 
                        width={32}
                        className="invert dark:invert-0 transition-all"
                    />
                    
                </Button>
                <div className="ml-auto flex items-center">
                <Label htmlFor="lock-in" className="mr-2 font-semibold justify-normal ">Lock In</Label>
                    <Switch id="lock-in" checked={isSwitchOn} onCheckedChange={handleSwitchChange} />
                    
                </div>
            </div>
           
        </div>
    );
};