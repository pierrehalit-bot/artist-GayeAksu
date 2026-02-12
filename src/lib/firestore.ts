import { adminDb } from "./firebase.admin";
import { Firestore } from "firebase-admin/firestore";

// Helper to get collection reference with type safety (somewhat)
export const getCollection = (collectionName: string) => {
    if (!adminDb) throw new Error("Firebase Admin not initialized");
    return adminDb.collection(collectionName);
};

// Generic converter can be added here if needed to transform Firestore data <-> App data
// For now we will do manual mapping in routes for flexibility
