"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Timer, Megaphone, Briefcase, Activity } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        countdowns: 0,
        announcements: 0,
        projects: 0
    });

    useEffect(() => {
        // Fetch simple stats
        Promise.all([
            fetch('/api/countdowns').then(res => res.json()),
            fetch('/api/announcements').then(res => res.json()),
            fetch('/api/projects').then(res => res.json())
        ]).then(([c, a, p]) => {
            setStats({
                countdowns: Array.isArray(c) ? c.length : 0,
                announcements: Array.isArray(a) ? a.length : 0,
                projects: Array.isArray(p) ? p.length : 0
            });
        });
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Sayaç</CardTitle>
                        <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.countdowns}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Duyurular</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.announcements}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projeler</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.projects}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Son Durum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Sistem durumu aktif.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
