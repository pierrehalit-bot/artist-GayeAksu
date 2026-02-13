"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/types";
import { formatDuration, intervalToDuration, isPast, Duration } from "date-fns";
import { Play } from "lucide-react";

interface CountdownHeroProps {
    countdown?: Countdown | null;
}

export default function CountdownHero({ countdown }: CountdownHeroProps) {
    const [timeLeft, setTimeLeft] = useState<Duration | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (!countdown) return;

        const targetDate = new Date(countdown.targetAt);

        const tick = () => {
            if (isPast(targetDate)) {
                setIsCompleted(true);
                setTimeLeft(null);
                return;
            }
            const duration = intervalToDuration({
                start: new Date(),
                end: targetDate,
            });
            setTimeLeft(duration);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    if (!countdown) return null;

    return (
        <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Video Background */}
            {countdown.videoUrl && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={countdown.videoPosterUrl}
                    className="absolute inset-0 h-full w-full object-cover z-0"
                >
                    <source src={countdown.videoUrl} type="video/mp4" />
                </video>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center text-white p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                    {countdown.title}
                </h1>
                {countdown.description && (
                    <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md opacity-90">
                        {countdown.description}
                    </p>
                )}

                {!isCompleted && timeLeft ? (
                    <div className="flex gap-4 md:gap-8 mb-8">
                        {/* Simple timer display - can be improved with custom blocks */}
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-6xl font-mono font-bold">
                                {String(timeLeft.days || 0).padStart(2, '0')}
                            </span>
                            <span className="text-sm uppercase tracking-widest">GÜN</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-mono">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-6xl font-mono font-bold">
                                {String(timeLeft.hours || 0).padStart(2, '0')}
                            </span>
                            <span className="text-sm uppercase tracking-widest">SAAT</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-mono">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-6xl font-mono font-bold">
                                {String(timeLeft.minutes || 0).padStart(2, '0')}
                            </span>
                            <span className="text-sm uppercase tracking-widest">DK</span>
                        </div>
                        <span className="text-4xl md:text-6xl font-mono">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl md:text-6xl font-mono font-bold">
                                {String(timeLeft.seconds || 0).padStart(2, '0')}
                            </span>
                            <span className="text-sm uppercase tracking-widest">SN</span>
                        </div>
                    </div>
                ) : isCompleted ? (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <h2 className="text-2xl font-bold mb-6">Yayında!</h2>
                        {countdown.onCompleteLink && (
                            <Button size="lg" className="text-lg px-8 py-6 rounded-full" asChild>
                                <Link href={
                                    countdown.onCompleteLinkType === 'youtube'
                                        ? `/watch/${extractYoutubeId(countdown.onCompleteLink)}`
                                        : countdown.onCompleteLink
                                } target={countdown.onCompleteLinkType !== 'youtube' ? "_blank" : undefined}>
                                    {countdown.onCompleteLinkType === 'youtube' ? <Play className="mr-2 h-6 w-6" /> : null}
                                    İzle / Dinle
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function extractYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}
