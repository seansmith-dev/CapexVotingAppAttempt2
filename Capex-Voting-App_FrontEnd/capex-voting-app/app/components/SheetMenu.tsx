"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SheetMenuProps {
    links: Array<{ href: string; text: string; icon: React.ReactNode }>;
}

export default function SheetMenu({ links }: SheetMenuProps) {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                    {links.map((link, index) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={index}
                                href={link.href}
                                className={`flex items-center gap-3 p-2 rounded-lg ${
                                    isActive
                                        ? "bg-gray-100 text-blue-600"
                                        : "hover:bg-gray-100"
                                }`}
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
    );
}
