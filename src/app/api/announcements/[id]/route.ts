import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { verifyAdmin } from "@/lib/auth";
import { announcementSchema } from "@/lib/validators";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const parsed = announcementSchema.partial().parse(json);

        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        await adminDb.collection("announcements").doc(params.id).update({
            ...parsed,
            updatedAt: new Date(),
        });

        return NextResponse.json({ message: "Updated" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        await adminDb.collection("announcements").doc(params.id).delete();

        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}
