import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { verifyAdmin } from "@/lib/auth";
import { bioSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
    try {
        if (!adminDb) return NextResponse.json({ error: "Database not available" }, { status: 500 });

        const doc = await adminDb.collection("bio").doc("current").get();

        if (!doc.exists) {
            // Return default empty bio structure if not found
            return NextResponse.json({
                artistName: "Artist Name",
                blocks: [],
                layout: [],
                socialLinks: {}
            });
        }

        return NextResponse.json(doc.data());
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
        const parsed = bioSchema.parse(json);

        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        await adminDb.collection("bio").doc("current").set({
            ...parsed,
            updatedAt: new Date(),
        });

        return NextResponse.json({ message: "Updated" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}
