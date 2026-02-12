import CountdownHero from "@/components/CountdownHero";
import AnnouncementCard from "@/components/AnnouncementCard";
import ProjectCard from "@/components/ProjectCard";
import { adminDb } from "@/lib/firebase.admin";
import { Announcement, Countdown, Project } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

async function getActiveCountdown() {
    if (!adminDb) return null;
    const snapshot = await adminDb.collection("countdowns")
        .where("isActive", "==", true)
        .orderBy("order", "asc")
        .limit(1)
        .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data(), targetAt: doc.data().targetAt?.toDate().toISOString() } as Countdown;
}

async function getLatestAnnouncements() {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("announcements")
        .where("isPublished", "==", true)
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() })) as Announcement[];
}

async function getFeaturedProjects() {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("projects")
        .where("isPublished", "==", true)
        .orderBy("createdAt", "desc")
        .limit(3)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() })) as Project[];
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
    const [countdown, announcements, projects] = await Promise.all([
        getActiveCountdown(),
        getLatestAnnouncements(),
        getFeaturedProjects()
    ]);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Hero Section */}
            {countdown && (
                <section className="relative">
                    <CountdownHero countdown={countdown} />
                </section>
            )}

            {/* Announcements Section */}
            {announcements.length > 0 && (
                <section className="container py-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Duyurular</h2>
                        <Button variant="ghost" asChild>
                            <Link href="/announcements">Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {announcements.map(announcement => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </div>
                </section>
            )}

            {/* Projects Preview Section */}
            {projects.length > 0 && (
                <section className="container py-16 bg-muted/30">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">Yakındaki Projeler</h2>
                        <Button variant="ghost" asChild>
                            <Link href="/projects">Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Links Footer-ish area */}
            <section className="py-12 border-t text-center">
                <Button variant="secondary" size="lg" asChild>
                    <Link href="/bio">Sanatçı Hakkında Daha Fazla</Link>
                </Button>
            </section>
        </div>
    );
}
