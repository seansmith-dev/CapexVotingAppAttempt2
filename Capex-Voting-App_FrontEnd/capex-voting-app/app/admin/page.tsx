"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import RegularNavBar from "../components/RegularNavBar";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Check for existing session on component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/adminLogin');
                if (response.ok) {
                    window.location.href = '/admin/dashboard';
                }
            } catch (err) {
                console.error('Session check failed:', err);
            }
        };
        checkSession();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/adminLogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                // Get the redirect URL from query parameters
                const searchParams = new URLSearchParams(window.location.search);
                const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
                router.push(redirectUrl);
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-between">
            <RegularNavBar heading="Admin Login"/>
            <div className="flex flex-1 items-center justify-center bg-[url('/background.png')] bg-cover bg-center">
                <div className="h-full w-full backdrop-blur-md absolute top-0 left-0"></div>
                <div className="z-1 bg-white p-8 m-8 rounded-lg shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                        Admin Login
                    </h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-900"
                            >
                                Username
                            </Label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1 px-2 text-gray-700"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-900"
                            >
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-1 px-2 text-gray-700"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
