import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex h-screen w-full bg-background">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
