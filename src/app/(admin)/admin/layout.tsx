"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AdminGuard from "@/components/AdminGuard";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    return (
        <AdminGuard>
            <div className="flex h-screen w-full bg-background">
                {!isLoginPage && <Sidebar />}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {!isLoginPage && <Topbar />}
                    <main className={`flex-1 overflow-y-auto ${!isLoginPage ? "p-4 md:p-6" : ""}`}>
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
