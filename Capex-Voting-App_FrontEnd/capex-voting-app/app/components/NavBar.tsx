"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NavBarProps {
    heading: string;
    links: Array<{
        href: string;
        text: string;
        icon: React.ReactNode;
        onClick?: () => void;
    }>;
    transparent?: boolean;
}

export default function NavBar({
    heading,
    links,
    transparent = false,
}: NavBarProps) {
    const pathname = usePathname();

    return (
        <nav
            className={`relative z-100 backdrop-blur-sm ${
                transparent
                    ? "bg-transparent"
                    : "bg-gray-900 shadow border-gray-700"
            }`}
        >
            <div className="w-full flex items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-6 flex-1">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={90}
                            height={50}
                            className="h-8 w-auto"
                        />
                    </Link>
                    <span className="flex-1 self-center text-xl font-semibold text-white md:text-left lg:text-left text-center truncate">
                        {heading}
                    </span>
                </div>
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:hidden bg-transparent border-transparent"
                        >
                            <Menu className="h-5 w-5 text-white" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className={`w-3/5 ${
                transparent
                    ? "bg-transparent border-transparent"
                    : "bg-gray-900 shadow border-gray-700"
            } backdrop-blur-sm shadow-md text-white mt-[22px]`}
                    >
                        <SheetHeader>
                            <SheetTitle className="text-white hidden">
                                Sidebar
                            </SheetTitle>
                            <SheetDescription className="text-white hidden">
                                Sidebar for navigation between routes
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col space-y-4">
                            {links.map((link, index) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={`flex items-center gap-3 p-2 ${
                                            isActive
                                                ? "bg-gray-100 text-blue-600"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={link.onClick}
                                    >
                                        <div className="flex items-center justify-center w-5 h-5">
                                            {link.icon}
                                        </div>
                                        <span>{link.text}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Desktop Menu */}
                <div className="hidden md:block">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:mr-8 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700">
                        {links.map((link, index) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        onClick={link.onClick}
                                        className={`flex items-center gap-2 py-2 px-3 rounded-sm md:p-0 ${
                                            isActive
                                                ? "text-blue-500 cursor-default pointer-events-none"
                                                : "text-white hover:bg-gray-700 md:hover:bg-transparent md:border-0 hover:text-blue-500"
                                        }`}
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                    >
                                        <div className="flex items-center justify-center w-5 h-5">
                                            {link.icon}
                                        </div>
                                        <span className="inline-block align-middle mt-0.5 truncate">
                                            {link.text}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
