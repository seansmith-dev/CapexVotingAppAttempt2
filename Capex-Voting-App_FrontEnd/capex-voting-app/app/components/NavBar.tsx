"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

interface NavBarProps {
    heading: string;
    links?: Array<{ href: string; text: string; icon: React.ReactNode }>;
}

export default function NavBar({ heading, links }: NavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="relative z-100 bg-gray-900/80 backdrop-blur-sm shadow-md border-gray-700">
            <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-6 flex-1">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={90}
                        height={50}
                        className="h-8 w-auto"
                    />
                    <span className="flex-1 self-center text-xl font-semibold whitespace-nowrap text-white md:text-left text-center">
                        {heading}
                    </span>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    aria-controls="navbar-solid-bg"
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 1h15M1 7h15M1 13h15"
                        />
                    </svg>
                </button>

                {/* Navigation Links */}
                <div
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } w-full md:block md:w-auto`}
                    id="navbar-solid-bg"
                >
                    <ul className="flex flex-col font-medium mt-4 rounded-lg md:mr-8 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-transparent md:dark:bg-transparent dark:border-gray-700">
                        {links?.map((link, index) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-2 py-2 px-3 rounded-sm md:p-0 ${
                                            isActive
                                                ? "text-blue-500 cursor-default pointer-events-none"
                                                : "text-white hover:bg-gray-700 md:hover:bg-transparent md:border-0 hover:text-blue-500"
                                        }`}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <div className="flex items-center justify-center w-5 h-5">
                                            {link.icon}
                                        </div>
                                        <span className="inline-block align-middle mt-0.5">
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
