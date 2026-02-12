"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AnnouncementForm from "./AnnouncementForm";

export default function NewAnnouncementPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/announcements"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Yeni Duyuru Ekle</h1>
            </div>
            <AnnouncementForm />
        </div>
    );
}
