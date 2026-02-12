import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";
import { verifyAdmin } from "@/lib/auth";
import { countdownSchema } from "@/lib/validators";

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
        const parsed = countdownSchema.partial().parse(json);

        if (!adminDb) return NextResponse.json({ error: "Database error" }, { status: 500 });

        const updateData: any = { ...parsed, updatedAt: new Date() };
        if (parsed.targetAt) {
            updateData.targetAt = new Date(parsed.targetAt);
        }

        await adminDb.collection("countdowns").doc(params.id).update(updateData);

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

        await adminDb.collection("countdowns").doc(params.id).delete();

        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Invalid Request" }, { status: 400 });
    }
}
