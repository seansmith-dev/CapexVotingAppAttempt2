"use client";

import { Home, User, BookOpen } from "lucide-react";
import NavBar from "./NavBar";

const links = [
    { href: "/", text: "Home", icon: <Home />, onClick: () => {console.log('going home')}, showOnLarge: true },
    { href: "/admin", text: "Admin", icon: <User />, showOnLarge: true },
    { href: "/guide", text: "Application Guide", icon: <BookOpen />, showOnLarge: true },
];

export default function RegularNavBar({heading, transparent=false}: {heading: string, transparent?: boolean}) {
    return <NavBar heading={heading} links={links} transparent={transparent} />;
}
