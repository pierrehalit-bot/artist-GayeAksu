"use client";

import { useEffect, useState } from "react";
import { CountdownForm } from "../new/page"; // Importing from sibling
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function EditCountdownPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/countdowns`) // Currently fetching all and finding one since get-one endpoint wasn't strictly asked but I implemented [id] PATCH/DELETE. I should probably add GET to [id].
            // For now, I'll filter client side or implement GET [id] logic in route.
            // Actually [id]/route.ts doesn't have GET.
            // I will add GET to [id]/route.ts or just filter from list if efficiency isn't huge concern yet.
            // Let's filter from list for speed of dev right now.
            .then(res => res.json())
            .then(list => {
                const found = list.find((i: any) => i.id === params.id);
                if (found) {
                    // Convert date string to Date object or compatible input string
                    // input[type=datetime-local] expects YYYY-MM-DDThh:mm
                    const d = new Date(found.targetAt);
                    // format to local ISO string without timezone (roughly)
                    // or just use what works.
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
