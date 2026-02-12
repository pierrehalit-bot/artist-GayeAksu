import BioRenderer from "@/components/BioRenderer";
import { adminDb } from "@/lib/firebase.admin";
import { ArtistBio } from "@/types";

async function getBio() {
    if (!adminDb) return null;
    const doc = await adminDb.collection("bio").doc("current").get();
    if (!doc.exists) return null;
    return doc.data() as ArtistBio;
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BioPage() {
    const bio = await getBio();

    if (!bio) {
        return <div className="p-8 text-center">Biyografi henüz oluşturulmadı.</div>;
    }

    return <BioRenderer bio={bio} />;
}
