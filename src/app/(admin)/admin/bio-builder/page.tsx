"use client";

import BioBuilder from "@/components/admin/BioBuilder";

export default function BioBuilderPage() {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-6">Biyografi Düzenleyici</h1>
            <BioBuilder />
        </div>
    );
}
