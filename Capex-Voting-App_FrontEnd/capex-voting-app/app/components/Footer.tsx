import React from "react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative z-10 bg-gray-700 text-white">
            <div className="container mx-auto px-4 py-8">
                <div>
                    <Image
                        src="/logo.png"
                        alt="Swinburne Logo"
                        width={150}
                        height={75}
                        className="mb-4"
                    />
                </div>
                <div className="grid grid-cols-3 gap-8">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                        <a href="/about" className="block hover:text-gray-300">
                            About
                        </a>
                        <a
                            href="/privacy"
                            className="block hover:text-gray-300"
                        >
                            Privacy
                        </a>
                        <p className="text-sm mt-4">
                            Eigth Avenue, Glenferrie Road,
                            <br />
                            3122, VIC, AU
                        </p>
                    </div>

                    {/* Additional Links */}
                    <div className="space-y-2">
                        <a
                            href="/projects"
                            className="block hover:text-gray-300"
                        >
                            Project List
                        </a>
                        <a
                            href="/assistant"
                            className="block hover:text-gray-300"
                        >
                            Navigation Assistant
                        </a>
                        <a href="/faq" className="block hover:text-gray-300">
                            FAQ
                        </a>
                    </div>

                    <div>
                        <h3 className="block">NEWSLETTER</h3>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex gap-4 mt-8">
                    <a
                        href="https://youtube.com"
                        className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                    </a>
                    <a
                        href="https://twitter.com"
                        className="bg-blue-400 p-2 rounded-full hover:bg-blue-500"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
