"use client";

import {
    Home,
    FileUp,
    BarChart2,
    LogOut,
    Pencil,
    BarChart,
    Printer,
    QrCode,
} from "lucide-react";
import NavBar from "./NavBar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AdminNavBar({ heading }: { heading: string }) {
    const router = useRouter();
    const adminLinks = [
        {
            href: "/admin/dashboard",
            text: "Dashboard",
            icon: <Home className="w-5 h-5" />,
            showOnLarge: false
        },
        {
            href: "/admin/projects/create",
            text: "Create Projects",
            icon: <FileUp className="w-5 h-5" />,
            showOnLarge: false
        },
        {
            href: "/admin/projects/edit",
            text: "Edit Projects",
            icon: <Pencil className="w-5 h-5" />,
            showOnLarge: false
        },
        {
            href: "/admin/qr/generate",
            text: "Generate QR Codes",
            icon: <QrCode className="w-5 h-5" />,
            showOnLarge: false
        },
        {
            href: "/admin/qr/print",
            text: "Print QR Codes",
            icon: <Printer className="w-5 h-5" />,
            showOnLarge: false
        },
        {
            href: "/admin/leaderboard/industry",
            text: "Industry Leaderboard",
            icon: <BarChart className="w-5 h-5" />,
            showOnLarge: true
        },
        {
            href: "/admin/leaderboard/guest",
            text: "Guest Leaderboard",
            icon: <BarChart2 className="w-5 h-5" />,
            showOnLarge: true
        },
        {
            href: "/",
            text: "Logout",
            icon: <LogOut className="w-5 h-5" />,
            showOnLarge: false,
            onClick: () => {
                Cookies.remove("admin-token");
                router.push("/admin");
            },
        },
    ];

    return (
        <NavBar 
            heading={heading} 
            links={adminLinks} 
            transparent={false}
            className="[&>nav>div>div>ul>li]:hidden [&>nav>div>div>ul>li]:md:block [&>nav>div>div>ul>li[data-show-on-large=true]]:block"
        />
    );
}
