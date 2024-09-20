import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
    href: string;
    label: string;
    isActive?: boolean;
    theme?: string;
};

export const NavButton = ({
    href,
    label,
    isActive,
    theme
}: Props) => {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-white/20 text-white' 
                : theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                    : 'text-black hover:bg-black/10 hover:text-black'
            }`}
        >
            {label}
        </Link>
    )
}