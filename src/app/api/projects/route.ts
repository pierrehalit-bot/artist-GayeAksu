import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { verifyAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    try {
        if (!adminDb) return NextResponse.json({ error: "Database not available" }, { status: 500 });

        const token = request.headers.get("Authorization");
        let isAdmin = false;
        if (token) {
            const verified = await verifyAdmin();
            if (verified) isAdmin = true;
        }

        let query = adminDb.collection("projects").orderBy("createdAt", "desc");

        if (!isAdmin) {
            query = query.where("isPublished", "==", true);
        }

        const snapshot = await query.get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() }));

        return NextResponse.json(data);
    } catch (error) {
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
        const parsed = projectSchema.parse(json);

        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        const ref = await adminDb.collection("projects").add({
            ...parsed,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ id: ref.id, message: "Created" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}
