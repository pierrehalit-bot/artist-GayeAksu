import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface WatchPageProps {
    params: {
        youtubeId: string;
    };
}

export default function WatchPage({ params }: WatchPageProps) {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <div className="p-4">
                <Button variant="ghost" asChild className="text-white hover:bg-white/10">
                    <Link href="/bio"><ArrowLeft className="mr-2 h-4 w-4" /> Biyografiye Dön</Link>
                </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 md:p-12">
                <div className="w-full max-w-5xl aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                    <iframe
                        src={`https://www.youtube.com/embed/${params.youtubeId}?autoplay=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
