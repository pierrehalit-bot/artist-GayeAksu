"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Countdown } from "@/types";
import Link from "next/link";
import { Plus, Trash, Edit } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { auth } from "@/lib/firebase.client";

export default function CountdownsPage() {
    const [countdowns, setCountdowns] = useState<Countdown[]>([]);

    useEffect(() => {
        fetch('/api/countdowns', {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token') || ''}` // Simple token placeholder, ideally use onAuthStateChanged token
            }
        }) // API route handles token check via header usually
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCountdowns(data);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;

        // Get token
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        await fetch(`/api/countdowns/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        setCountdowns(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Sayaç Yönetimi</h1>
                <Button asChild>
                    <Link href="/admin/countdowns/new"><Plus className="mr-2 h-4 w-4" /> Yeni Ekle</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {countdowns.map(countdown => (
                    <Card key={countdown.id} className="flex flex-row items-center justify-between p-6">
                        <div>
                            <CardTitle className="text-xl">{countdown.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">Hedef Tarih: {format(new Date(countdown.targetAt), "dd MMM yyyy HH:mm", { locale: tr })}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${countdown.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {countdown.isActive ? "Aktif" : "Pasif"}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                                    Sıra: {countdown.order}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/countdowns/${countdown.id}`}><Edit className="h-4 w-4" /></Link>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(countdown.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {countdowns.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">Henüz sayaç eklenmemiş.</div>
                )}
            </div>
        </div>
    );
}
