"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Simple placeholder settings. Most real settings (social, artist name) are currently in Bio Builder.
// We can use this for specific global configs not related to Bio.
// Or we can duplicate/link the social links here.
// For now, I'll put a placeholder or just redirect to Bio Builder in text.

export default function SettingsPage() {
    const { toast } = useToast();

    return (
        <div className="space-y-6 max-w-xl">
            <h1 className="text-3xl font-bold">Ayarlar</h1>
            <div className="p-4 border rounded bg-muted/20">
                <p>
                    Sanatçı adı, sosyal medya linkleri ve profil görseli gibi ayarlar
                    <strong> Biyografi Düzenleyici</strong> sayfasından yönetilmektedir.
                </p>
            </div>

            <div className="grid gap-4 opacity-50 pointer-events-none">
                <div className="grid gap-2">
                    <Label>Site Başlığı (SEO)</Label>
                    <Input defaultValue="Official Artist Website" />
                </div>
                <Button>Kaydet</Button>
            </div>
        </div>
    );
}
