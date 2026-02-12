"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { announcementSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { auth, storage } from "@/lib/firebase.client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";
import { getAuth } from "firebase/auth";

export default function AnnouncementForm({ defaultValues, id }: { defaultValues?: any, id?: string }) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(announcementSchema),
        defaultValues: defaultValues || {
            isPublished: true,
            title: "",
            content: "",
            coverImageUrl: "",
            tags: []
        }
    });

    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            if (!token) throw new Error("Not authenticated");

            const url = id ? `/api/announcements/${id}` : '/api/announcements';
            const method = id ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to save");
            }

            toast({ title: "Başarılı", description: "Duyuru kaydedildi." });
            router.push("/admin/announcements");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: error.message });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `announcements/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            setValue("coverImageUrl", url);
            toast({ title: "Yüklendi", description: "Görsel yüklendi." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: "Yükleme başarısız." });
        } finally {
            setUploading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message as string}</p>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="content">İçerik</Label>
                    <Textarea id="content" className="min-h-[200px]" {...register("content")} />
                    {errors.content && <p className="text-red-500 text-sm">{errors.content.message as string}</p>}
                </div>

                <div className="grid gap-2">
                    <Label>Kapak Görseli</Label>
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    <Input type="hidden" {...register("coverImageUrl")} />
                    {watch("coverImageUrl") && (
                        <div className="mt-2 relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                            <img src={watch("coverImageUrl")} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Switch 
                        id="isPublished" 
                        checked={watch("isPublished")} 
                        onCheckedChange={(val) => setValue("isPublished", val)} 
                    />
                    <Label htmlFor="isPublished">Yayınla</Label>
                </div>
            </div>

            <Button type="submit" disabled={uploading}>
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kaydet
            </Button>
        </form>
    );
}
