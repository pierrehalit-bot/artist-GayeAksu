"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { auth, storage } from "@/lib/firebase.client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/projects"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-2xl font-bold">Yeni Proje Ekle</h1>
            </div>
            <ProjectForm />
        </div>
    );
}

export function ProjectForm({ defaultValues, id }: { defaultValues?: any, id?: string }) {
    const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: defaultValues || {
            isPublished: true,
            links: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "links"
    });

    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Not authenticated");

            const url = id ? `/api/projects/${id}` : '/api/projects';
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

            toast({ title: "Başarılı", description: "Proje kaydedildi." });
            router.push("/admin/projects");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Hata", description: error.message });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setValue("coverImageUrl", url);
            toast({ title: "Yüklendi", description: "Görsel yüklendi." });
        } catch (error) {
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
                    <Label htmlFor="summary">Özet</Label>
                    <Textarea id="summary" {...register("summary")} />
                    {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Şehir</Label>
                        <Input {...register("location.city")} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Enlem (Lat)</Label>
                        <Input type="number" step="any" {...register("location.lat", { valueAsNumber: true })} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Boylam (Lng)</Label>
                        <Input type="number" step="any" {...register("location.lng", { valueAsNumber: true })} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Kapak Görseli</Label>
                    <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                    <Input type="hidden" {...register("coverImageUrl")} />
                </div>

                <div className="grid gap-2">
                    <Label>Linkler</Label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input placeholder="Etiket (Örn: Bilet Al)" {...register(`links.${index}.label`)} />
                            <Input placeholder="URL" {...register(`links.${index}.url`)} />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ label: "", url: "" })}>
                        + Link Ekle
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch id="isPublished" checked={watch("isPublished")} onCheckedChange={(val) => setValue("isPublished", val)} />
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
