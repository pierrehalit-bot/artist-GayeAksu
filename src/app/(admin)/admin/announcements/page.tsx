"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Announcement } from "@/types";
import Link from "next/link";
import { Plus, Trash, Edit } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { auth } from "@/lib/firebase.client";

export default function AnnouncementsPage() {
    const [list, setList] = useState<Announcement[]>([]);

    useEffect(() => {
        fetch('/api/announcements', {
            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setList(data);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Silmek istediğinize emin misiniz?")) return;
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        await fetch(`/api/announcements/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        setList(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Duyuru Yönetimi</h1>
                <Button asChild>
                    <Link href="/admin/announcements/new"><Plus className="mr-2 h-4 w-4" /> Yeni Ekle</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {list.map(item => (
                    <Card key={item.id} className="flex flex-row items-center justify-between p-6">
                        <div>
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">Oluşturulma: {item.createdAt ? format(new Date(item.createdAt), "dd MMM yyyy", { locale: tr }) : "-"}</p>
                            <div className="flex gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {item.isPublished ? "Yayında" : "Taslak"}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/announcements/${item.id}`}><Edit className="h-4 w-4" /></Link>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
                {list.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">Henüz duyuru eklenmemiş.</div>
                )}
            </div>
        </div>
    );
}
