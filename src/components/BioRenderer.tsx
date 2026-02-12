"use client";

import { ArtistBio, BioBlock } from "@/types";
import { cn } from "@/lib/utils";
import SocialFollowButtons from "./SocialFollowButtons";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface BioRendererProps {
    bio: ArtistBio;
}

export default function BioRenderer({ bio }: BioRendererProps) {
    // Sort blocks based on layout order if available, or just render them
    // For the exact grid layout, we would need to map the layout items to CSS grid.
    // Assuming 12-column grid system.

    // We need to merge blocks with their layout info
    const renderBlocks = bio.blocks.map(block => {
        const layoutItem = bio.layout.find(l => l.blockId === block.id);
        return {
            ...block,
            layout: layoutItem
        }
    }).sort((a, b) => (a.layout?.y || 0) - (b.layout?.y || 0) || (a.layout?.x || 0) - (b.layout?.x || 0));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header / Hero */}
            <div className="flex flex-col items-center mb-12 text-center">
                {bio.heroImageUrl && (
                    <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                        <Image
                            src={bio.heroImageUrl}
                            alt={bio.artistName}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{bio.artistName}</h1>
                <SocialFollowButtons socialLinks={bio.socialLinks} />
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
                {renderBlocks.map((block) => (
                    <div
                        key={block.id}
                        className={cn(
                            "relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow",
                            // Simple responsive mapping: always full width on mobile, grid span on desktop
                            `md:col-span-${Math.min(block.layout?.w || 12, 12)}`,
                            `md:row-span-${block.layout?.h || 1}`,
                        )}
                        style={{
                            // Optional: use gridRow/gridColumn for precise placement if needed, 
                            // but col-span class is often enough for simple flow.
                        }}
                    >
                        <BioBlockContent block={block} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function BioBlockContent({ block }: { block: BioBlock }) {
    switch (block.type) {
        case 'text':
            return (
                <div className="p-6 prose dark:prose-invert max-w-none">
                    <p className="whites-pre-wrap">{block.data.text}</p>
                </div>
            );
        case 'image':
            return (
                <div className="relative w-full h-full min-h-[200px]">
                    {block.data.imageUrl ? (
                        <Image
                            src={block.data.imageUrl}
                            alt="Gallery"
                            fill
                            className="object-cover"
                        />
                    ) : <div className="bg-muted w-full h-full flex items-center justify-center">No Image</div>}
                </div>
            );
        case 'youtube':
            return (
                <div className="relative w-full h-full aspect-video group">
                    {block.data.youtubeUrl ? (
                        <>
                            <Image
                                src={`https://img.youtube.com/vi/${extractYoutubeId(block.data.youtubeUrl)}/hqdefault.jpg`}
                                alt="Video Thumbnail"
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Link
                                    href={`/watch/${extractYoutubeId(block.data.youtubeUrl)}`}
                                    className="bg-red-600 text-white p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform"
                                >
                                    <Play className="fill-white" />
                                </Link>
                            </div>
                        </>
                    ) : <div className="bg-muted p-4">No Video URL</div>}
                </div>
            );
        case 'cta':
            return (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4 bg-primary/5">
                    <h3 className="text-xl font-bold">{block.data.text}</h3>
                    {block.data.ctaUrl && (
                        <Button size="lg" asChild>
                            <a href={block.data.ctaUrl} target="_blank" rel="noopener noreferrer">
                                {block.data.ctaLabel || "Click Here"}
                            </a>
                        </Button>
                    )}
                </div>
            );
        default:
            return null;
    }
}

function extractYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url ? url.match(regExp) : null;
    return (match && match[2].length === 11) ? match[2] : url;
}
