"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Loader2, MapPinOff } from "lucide-react";

// Haversine formula to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        // Fetch all projects first
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Request location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Geolocation error or denied", error);
                    setLocationError(true);
                }
            );
        } else {
            setLocationError(true);
        }
    }, []);

    // Sort projects if we have user location
    const sortedProjects = [...projects].map(p => {
        if (userLocation && p.location?.lat && p.location?.lng) {
            const dist = calculateDistance(userLocation.lat, userLocation.lng, p.location.lat, p.location.lng);
            return { ...p, distanceKm: dist };
        }
        return p;
    }).sort((a, b) => {
        if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
            return a.distanceKm - b.distanceKm;
        }
        // If one has distance and other doesn't, put distance one first
        if (a.distanceKm !== undefined) return -1;
        if (b.distanceKm !== undefined) return 1;
        // Default sort by date (already sorted by API but good to keep stable)
        return 0;
    });

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold tracking-tight">Projeler</h1>
                {locationError ? (
                    <div className="flex items-center text-muted-foreground text-sm gap-2">
                        <MapPinOff className="h-4 w-4" />
                        Konum izni verilmedi, varsayılan sıralama.
                    </div>
                ) : !userLocation ? (
                    <div className="flex items-center text-muted-foreground text-sm gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Konum alınıyor...
                    </div>
                ) : (
                    <div className="flex items-center text-primary text-sm gap-2">
                        Yakınınızdaki projelere göre sıralandı.
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
