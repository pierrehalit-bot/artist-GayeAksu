"use client";

import { useEffect, useState } from "react";
import CountdownForm from "../new/CountdownForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EditCountdownPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/countdowns`)
            .then(res => res.json())
            .then(list => {
                const found = list.find((i: any) => i.id === params.id);
                if (found) {
                    const d = new Date(found.targetAt);
                    const formattedDate = format(d, "yyyy-MM-dd'T'HH:mm");
                    setData({ ...found, targetAt: formattedDate });
                }
                setLoading(false);
            });
    }, [params.id]);

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div className="p-8">Bulunamadı</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/countdowns"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Sayacı Düzenle</h1>
            </div>
            <CountdownForm defaultValues={data} id={params.id} />
        </div>
    );
}
