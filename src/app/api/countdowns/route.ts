import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { verifyAdmin } from "@/lib/auth";
import { countdownSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    try {
        if (!adminDb) return NextResponse.json({ error: "Database not available" }, { status: 500 });

        // Check if public or admin request. 
        // Public: only active. Admin: all.
        // However, verifyAdmin requires a token header. 
        // Usually public GET doesn't send token.

        const token = request.headers.get("Authorization");
        let isAdmin = false;

        if (token) {
            // Try validation
            const verified = await verifyAdmin();
            if (verified) isAdmin = true;
        }

        let query = adminDb.collection("countdowns").orderBy("order", "asc");

        if (!isAdmin) {
            query = query.where("isActive", "==", true);
        }

        const snapshot = await query.get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), targetAt: doc.data().targetAt?.toDate().toISOString() }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("GET countdowns error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const parsed = countdownSchema.parse(json);

        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        const ref = await adminDb.collection("countdowns").add({
            ...parsed,
            targetAt: new Date(parsed.targetAt), // Ensure date object
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ id: ref.id, message: "Created" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}
