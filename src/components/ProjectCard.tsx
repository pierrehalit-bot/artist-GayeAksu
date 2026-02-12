import { Project } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 w-full">
                {project.coverImageUrl ? (
                    <Image
                        src={project.coverImageUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        Img Placeholder
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span>{project.title}</span>
                    {typeof project.distanceKm === 'number' && (
                        <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.distanceKm.toFixed(1)} km
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground line-clamp-3 text-sm">
                    {project.summary}
                </p>
                {project.location?.city && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {project.location.city}
                    </div>
                )}
            </CardContent>
            {project.links && project.links.length > 0 && (
                <CardFooter className="flex flex-wrap gap-2">
                    {project.links.map((link, idx) => (
                        <Button key={idx} variant="outline" size="sm" asChild>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        </Button>
                    ))}
                </CardFooter>
            )}
        </Card>
    );
}
