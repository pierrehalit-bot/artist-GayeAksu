"use client";

import { useEffect, useState } from "react";
import { AnnouncementForm } from "../new/page";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/announcements`)
            .then(res => res.json())
            .then(list => {
                const found = list.find((i: any) => i.id === params.id);
                if (found) setData(found);
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-8">Bulunamadı</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/announcements"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Duyuruyu Düzenle</h1>
            </div>
            <AnnouncementForm defaultValues={data} id={params.id} />
        </div>
    );
}
