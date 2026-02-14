import { adminDb } from "@/lib/firebase.admin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ error: "Geçersiz kullanıcı adı" }, { status: 400 });
        }

        const normalizedUsername = username.trim().toLowerCase();

        if (!adminDb) {
            console.error("Firebase Admin SDK not initialized");
            return NextResponse.json({ error: "Sistem hatası" }, { status: 500 });
        }

        // Query the admin_users collection
        const snapshot = await adminDb.collection("admin_users")
            .where("username", "==", normalizedUsername)
            .where("isActive", "==", true)
            .limit(1)
            .get();

        if (snapshot.empty) {
            // Security: Consider timing attacks if critical, but for now standard response
            return NextResponse.json({ error: "Kullanıcı adı bulunamadı" }, { status: 404 });
        }

        const userDoc = snapshot.docs[0].data();
        
        if (!userDoc.email) {
            return NextResponse.json({ error: "Kullanıcı yapılandırma hatası" }, { status: 500 });
        }

        return NextResponse.json({ email: userDoc.email });

    } catch (error) {
        console.error("Resolve username error:", error);
        return NextResponse.json({ error: "Sistem hatası, tekrar deneyin" }, { status: 500 });
    }
}
