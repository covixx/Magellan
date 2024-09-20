  "use client";
  import { useUser } from "@clerk/nextjs";
  import Link from "next/link"
  import Image from "next/image"
  import { useTheme } from "next-themes";
  import { Button } from "@/components/ui/button"
  import { useEffect, useState } from 'react';

  export const WelcomeMsg = () => {
      const { user, isLoaded } = useUser();
      const { theme, setTheme } = useTheme();
      const [mounted, setMounted] = useState(false);

      useEffect(() => {
          setMounted(true);
      }, []);

      if (!mounted) {
          return null;
      }

      return (
          <div className="gap-y-4 m-15">
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
              </div>
              <p className="text-sm font-extralight">
                  Here's the agenda for today.
              </p>
          </div>
      );
  };