import { Announcement } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Need to create Badge
import { format } from "date-fns";
import Image from "next/image";

interface AnnouncementCardProps {
    announcement: Announcement;
    onClick?: () => void;
}

export default function AnnouncementCard({ announcement, onClick }: AnnouncementCardProps) {
    return (
        <Card
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-muted-foreground">
                        {announcement.createdAt ? format(new Date(announcement.createdAt), "dd MMM yyyy") : "Yeni"}
                    </span>
                    {announcement.tags && announcement.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end">
                            {announcement.tags.map(tag => (
                                <span key={tag} className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4">
                    {announcement.coverImageUrl && (
                        <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden">
                            <Image
                                src={announcement.coverImageUrl}
                                alt={announcement.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {announcement.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
