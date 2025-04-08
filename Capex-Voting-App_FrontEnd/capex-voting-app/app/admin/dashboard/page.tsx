"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function AdminDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove("admin-token");
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 text-gray-900">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/admin/qr/generate" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
                            <h2 className="text-xl font-bold text-blue-900 mb-2">Generate QR Codes</h2>
                            <p className="text-blue-700">Create & print new QR codes for voters</p>
                        </Link>
                        
                        <Link href="/admin/qr/print" className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition-colors">
                            <h2 className="text-xl font-bold text-green-900 mb-2">Print QR Codes</h2>
                            <p className="text-green-700">Print non-printed QR codes for distribution</p>
                        </Link>

                        <Link href="/admin/leaderboard/industry" className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition-colors">
                            <h2 className="text-xl font-bold text-purple-900 mb-2">Industry Leaderboards</h2>
                            <p className="text-purple-700">Track rankings of projects voted by Industry voters</p>
                        </Link>

                        <Link href="/admin/leaderboard/guest" className="bg-orange-50 p-6 rounded-lg hover:bg-orange-100 transition-colors">
                            <h2 className="text-xl font-bold text-orange-900 mb-2">Guest Leaderboard</h2>
                            <p className="text-orange-700">Track rankings of projects voted by Guest or Student voters</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
