"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase.client";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Login sayfasındaysak kontrol yapma
        if (pathname === "/admin/login") {
            setLoading(false);
            setAuthorized(true);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/admin/login");
                setLoading(false);
                return;
            }

            // Optional: Check if the user is actually an admin by claim or helper API
            // For now, simpler client-side check is to assume if logged in via our secure login page (which should verify admin), it's ok.
            // BUT for security, the API routes and getServerSideProps/Server Components must do the real check.
            // Here we just check if they are authenticated.

            setAuthorized(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Admin paneli yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
