"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SocialLinks } from "@/types";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SocialFollowButtonsProps {
    socialLinks: SocialLinks;
}

export default function SocialFollowButtons({ socialLinks }: SocialFollowButtonsProps) {
    if (!socialLinks) return null;

    return (
        <div className="flex justify-center gap-4 mt-8">
            {socialLinks.youtube && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 border-none text-white">
                            <Youtube className="w-6 h-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Abone Ol</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            {/* Note: Google Subscribe Embed requires script injection which can be tricky in SPA. 
                   Using a direct link/iframe fallback is safer. */}
                            <p className="text-center text-muted-foreground">
                                YouTube kanalımıza abone olarak en yeni içeriklerden haberdar olun.
                            </p>
                            <Button className="bg-red-600 hover:bg-red-700 text-white w-full" asChild>
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                                    YouTube Kanalına Git
                                </a>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {socialLinks.instagram && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-pink-600 hover:bg-pink-700 border-none text-white">
                            <Instagram className="w-6 h-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Instagram'da Takip Et</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <p className="text-center text-muted-foreground">
                                Güncel paylaşımlar ve hikayeler için Instagram'da takip edin.
                            </p>
                            <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full" asChild>
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    Instagram Profilini Aç
                                </a>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {socialLinks.facebook && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 border-none text-white">
                            <Facebook className="w-6 h-6" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Facebook'ta Takip Et</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4 w-full">
                            {/* Facebook Page Plugin Iframe */}
                            <iframe
                                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(socialLinks.facebook)}&tabs&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`}
                                width="340"
                                height="130"
                                style={{ border: 'none', overflow: 'hidden' }}
                                allowFullScreen={true}
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                            </iframe>
                            <Button variant="link" asChild>
                                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                    Veya sayfayı yeni sekmede aç
                                </a>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
