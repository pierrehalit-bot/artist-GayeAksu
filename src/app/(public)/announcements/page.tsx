import { adminDb } from "@/lib/firebase.admin";
import { Announcement } from "@/types";
import AnnouncementCard from "@/components/AnnouncementCard";

async function getAnnouncements() {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("announcements")
        .where("isPublished", "==", true)
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() })) as Announcement[];
}

export const revalidate = 60;

export default async function AnnouncementsPage() {
    const announcements = await getAnnouncements();

    return (
        <div className="container py-12">
            <h1 className="text-4xl font-bold tracking-tight mb-8">Duyurular</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {announcements.map(announcement => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
            </div>
        </div>
    );
}
