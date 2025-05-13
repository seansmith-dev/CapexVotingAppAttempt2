"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle, FileUp, Pencil, QrCode, Printer, BarChart, BarChart2 } from "lucide-react";
import AdminLayout from "@/app/layouts/admin";
import { toast } from "sonner";

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/adminLogin');
                if (!response.ok) {
                    toast.error("Please login to access the admin dashboard");
                    router.push('/admin');
                }
            } catch (err) {
                console.error('Session check failed:', err);
                toast.error("Session check failed. Please login again.");
                router.push('/admin');
            }
        };
        checkSession();
    }, [router]);

    return (
        <AdminLayout heading="Admin Dashboard">
            <div className="flex flex-col flex-1 justify-center p-8 overflow-auto">
                <div className="min-w-[70vw] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto">
                        {/* Project Management */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-8">
                            <h2 className="text-2xl text-center font-bold text-gray-900 mb-8">
                                Project Management
                            </h2>
                            <div className="space-y-4">
                                <Link
                                    href="/admin/projects/create"
                                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <PlusCircle className="text-blue-600" />
                                    <span className="text-blue-900">
                                        Create New Project
                                    </span>
                                </Link>
                                
                                <Link
                                    href="/admin/projects/edit"
                                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Pencil className="text-blue-600" />
                                    <span className="text-blue-900">
                                        Edit Projects
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* QR Code Management */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-8">
                            <h2 className="text-2xl text-center font-bold text-gray-900 mb-8">
                                QR Code Management
                            </h2>
                            <div className="space-y-4">
                                <Link
                                    href="/admin/qr/generate"
                                    className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <QrCode className="text-green-600" />
                                    <span className="text-green-900">
                                        Generate QR Codes
                                    </span>
                                </Link>
                                <Link
                                    href="/admin/qr/print"
                                    className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <Printer className="text-green-600" />
                                    <span className="text-green-900">
                                        Print QR Codes
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Leaderboards */}
                        <div className="bg-white rounded-lg shadow p-4 md:p-8">
                            <h2 className="text-2xl text-center font-bold text-gray-900 mb-8">
                                Leaderboards
                            </h2>
                            <div className="space-y-4">
                                <Link
                                    href="/admin/leaderboard/industry"
                                    className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <BarChart className="text-purple-600" />
                                    <span className="text-purple-900">
                                        Industry Leaderboard
                                    </span>
                                </Link>
                                <Link
                                    href="/admin/leaderboard/guest"
                                    className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                >
                                    <BarChart2 className="text-purple-600" />
                                    <span className="text-purple-900">
                                        Guest Leaderboard
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
