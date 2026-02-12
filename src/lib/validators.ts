import { z } from "zod";

export const countdownSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    description: z.string().optional(),
    targetAt: z.coerce.date({ required_error: "Tarih ve saat seçiniz" }),
    videoUrl: z.string().optional(),
    videoPosterUrl: z.string().optional(),
    onCompleteLink: z.string().optional(),
    onCompleteLinkType: z.enum(["youtube", "music", "other"]).default("other"),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
});

export const announcementSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    content: z.string().min(1, "İçerik zorunludur"),
    coverImageUrl: z.string().optional(),
    tags: z.array(z.string()).default([]),
    location: z.object({
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
    }).optional(),
    isPublished: z.boolean().default(true),
});

export const projectSchema = z.object({
    title: z.string().min(1, "Başlık zorunludur"),
    summary: z.string().min(1, "Özet zorunludur"),
    coverImageUrl: z.string().optional(),
    location: z.object({
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
    }).optional(),
    links: z.array(z.object({
        label: z.string(),
        url: z.string().url(),
    })).default([]),
    isPublished: z.boolean().default(true),
});

export const bioBlockSchema = z.object({
    id: z.string(),
    type: z.enum(["text", "image", "youtube", "cta"]),
    data: z.object({
        text: z.string().optional(),
        imageUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        ctaLabel: z.string().optional(),
        ctaUrl: z.string().optional(),
    }),
});

export const layoutItemSchema = z.object({
    blockId: z.string(),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
    order: z.number(),
});

export const bioSchema = z.object({
    artistName: z.string().min(1, "Sanatçı adı zorunludur"),
    heroImageUrl: z.string().optional(),
    blocks: z.array(bioBlockSchema),
    layout: z.array(layoutItemSchema),
    socialLinks: z.object({
        youtube: z.string().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
    }),
});
