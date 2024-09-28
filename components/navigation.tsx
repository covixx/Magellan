"use client";

import { usePathname } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";

const routes = [
    {
        href: "/",
        label: "Dashboard",
    },
    {
        href: "/habits",
        label: "Habits",
    },
    {
        href: "/tasks",
        label: "Tasks",
    },
    {
        href: "/gym",
        label: "Gym",
    },
    {
        href: "/nutrition",
        label: "Nutrition",
    },
    {
        href: "/settings",
        label: "Settings",
    },
    {
        href: "/lockingin",
        label: "Locking in",
    }
]
const filteredRoutes = routes.filter((route) => route.label !== "Locking in");
export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);
    const { theme } = useTheme();

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                {/* ... */}
                <SheetContent side="left" className="px-2">
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {filteredRoutes.map((route) => (
                            <Button
                                key={route.href}
                                variant={route.href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                                className="justify-start"
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }
    
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {filteredRoutes.map((route) => (
                <NavButton 
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                    theme={theme}
                />
            ))}
        </nav>
    );
}