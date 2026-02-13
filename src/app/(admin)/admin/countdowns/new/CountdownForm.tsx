"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { countdownSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { auth, storage } from "@/lib/firebase.client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";

export default function CountdownForm({ defaultValues, id }: { defaultValues?: any, id?: string }) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(countdownSchema),
        defaultValues: defaultValues || {
            isActive: true,
            order: 0,
            onCompleteLinkType: 'other'
        }
    });

    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            const url = id ? `/api/countdowns/${id}` : '/api/countdowns';
            const method = id ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to save");

            toast({ title: "Başarılı", description: "Sayaç kaydedildi." });
            router.push("/admin/countdowns");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Hata", description: error.message });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'videoUrl' | 'videoPosterUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `countdowns/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setValue(fieldName, url);
            toast({ title: "Yüklendi", description: "Dosya başarıyla yüklendi." });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Hata", description: "Dosya yüklenemedi." });
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
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea id="description" {...register("description")} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="targetAt">Hedef Tarih</Label>
                    <Input id="targetAt" type="datetime-local" {...register("targetAt")} />
                    {errors.targetAt && <p className="text-red-500 text-sm">{errors.targetAt.message as string}</p>}
                </div>

                <div className="grid gap-2">
                    <Label>Video Dosyası (MP4/WebM)</Label>
                    <Input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} disabled={uploading} />
                    {watch("videoUrl") && <p className="text-xs text-green-600">Video yüklendi: {watch("videoUrl")}</p>}
                </div>

                <div className="grid gap-2">
                    <Label>Video Poster Görseli</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'videoPosterUrl')} disabled={uploading} />
                    {watch("videoPosterUrl") && <img src={watch("videoPosterUrl")} className="h-20 w-auto rounded" />}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="onCompleteLink">Tamamlanınca Yönlendirilecek Link</Label>
                    <Input id="onCompleteLink" placeholder="https://..." {...register("onCompleteLink")} />
                </div>

                <div className="grid gap-2">
                    <Label>Tamamlanma Türü</Label>
                    <Select onValueChange={(val) => setValue("onCompleteLinkType", val as any)} defaultValue={watch("onCompleteLinkType")}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="music">Müzik Platformu</SelectItem>
                            <SelectItem value="other">Diğer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        id="isActive"
                        checked={watch("isActive")}
                        onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                    <Label htmlFor="isActive">Aktif Durumda</Label>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="order">Sıralama (Düşük olan önce gösterilir)</Label>
                    <Input type="number" id="order" {...register("order", { valueAsNumber: true })} />
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                    {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploading ? "Yükleniyor..." : "Kaydet"}
                </Button>
            </div>
        </form>
    );
}
