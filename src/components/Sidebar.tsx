"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Timer,
    Megaphone,
    Briefcase,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import { auth } from "@/lib/firebase.client";
import { signOut } from "firebase/auth";
import { Button } from "./ui/button";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/countdowns", icon: Timer, label: "Countdowns" },
    { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
    { href: "/admin/projects", icon: Briefcase, label: "Projects" },
    { href: "/admin/bio-builder", icon: User, label: "Bio Builder" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-4 font-bold text-lg">
                Admin Panel
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
