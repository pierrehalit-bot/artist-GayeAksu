import { adminAuth, adminDb } from "./firebase.admin";
import { headers } from "next/headers";

export async function verifyAdmin() {
    const headersList = headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];

    if (!token || !adminAuth) {
        return null;
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;

        const allowedUids = process.env.ADMIN_UIDS?.split(",") || [];

        // Check ENV
        if (allowedUids.includes(uid)) {
            return decodedToken;
        }

        // Check Firestore 'admins' collection
        if (adminDb) {
            const adminDoc = await adminDb.collection("admins").doc(uid).get();
            if (adminDoc.exists) {
                return decodedToken;
            }
        }

        return null; // Not authorized
    } catch (error) {
        console.error("verifyAdmin error", error);
        return null;
    }
}
