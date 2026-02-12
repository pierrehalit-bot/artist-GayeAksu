import "server-only";
import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
            : undefined;

        if (privateKey && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
            });
        } else {
            console.warn("FIREBASE_PRIVATE_KEY, PROJECT_ID or CLIENT_EMAIL is missing. Admin SDK initialization skipped.");
        }
    } catch (error) {
        console.error("Firebase admin initialization error", error);
    }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminStorage = admin.apps.length ? admin.storage() : null;
