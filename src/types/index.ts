import { Timestamp } from "firebase/firestore";

export interface ArtistBio {
    artistName: string;
    heroImageUrl?: string;
    blocks: BioBlock[];
    layout: LayoutItem[];
    socialLinks: SocialLinks;
    updatedAt?: any; // Firestore Timestamp or Date
}

export interface SocialLinks {
    youtube?: string;
    instagram?: string;
    facebook?: string;
}

export type BioBlockType = "text" | "image" | "youtube" | "cta";

export interface BioBlock {
    id: string;
    type: BioBlockType;
    data: {
        text?: string;
        imageUrl?: string;
        youtubeUrl?: string; // or ID
        ctaLabel?: string;
        ctaUrl?: string;
    };
}

export interface LayoutItem {
    blockId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    order: number;
}

export interface Countdown {
    id: string;
    title: string;
    description?: string;
    targetAt: any; // Firestore Timestamp or Date string
    videoUrl?: string;
    videoPosterUrl?: string;
    onCompleteLink?: string;
    onCompleteLinkType: "youtube" | "music" | "other";
    isActive: boolean;
    order: number;
    createdAt?: any;
    updatedAt?: any;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    coverImageUrl?: string;
    tags: string[];
    location?: {
        city?: string;
        lat?: number;
        lng?: number;
    };
    startsAt?: any;
    endsAt?: any;
    isPublished: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface Project {
    id: string;
    title: string;
    summary: string;
    coverImageUrl?: string;
    location?: {
        city?: string;
        lat?: number;
        lng?: number;
    };
    links?: { label: string; url: string }[];
    isPublished: boolean;
    createdAt?: any;
    updatedAt?: any;
    distanceKm?: number; // Calculated on client
}
