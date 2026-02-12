"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BioBlock, LayoutItem, SocialLinks } from "@/types";
import { Trash, GripVertical, Type, Image as ImageIcon, Youtube, MousePointerClick } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// --- Draggable Block Component ---
function SortableBlock({ id, block, onClick, isActive }: { id: string, block: BioBlock, onClick: () => void, isActive: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group bg-card border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${isActive ? 'ring-2 ring-primary' : ''}`}
            onClick={onClick}
        >
            <div {...attributes} {...listeners} className="absolute top-2 right-2 cursor-grab opacity-0 group-hover:opacity-50 hover:opacity-100 p-1">
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-2 mb-2">
                {block.type === 'text' && <Type className="h-4 w-4" />}
                {block.type === 'image' && <ImageIcon className="h-4 w-4" />}
                {block.type === 'youtube' && <Youtube className="h-4 w-4" />}
                {block.type === 'cta' && <MousePointerClick className="h-4 w-4" />}
                <span className="font-bold text-sm capitalize">{block.type}</span>
            </div>

            <div className="text-xs text-muted-foreground line-clamp-2 overflow-hidden h-8">
                {block.type === 'text' && block.data.text}
                {block.type === 'image' && (block.data.imageUrl ? "Image Set" : "No Image")}
                {block.type === 'youtube' && (block.data.youtubeUrl || "No URL")}
                {block.type === 'cta' && (block.data.ctaLabel || "Button")}
            </div>
        </div>
    );
}

export default function BioBuilder() {
    const [blocks, setBlocks] = useState<BioBlock[]>([]);
    const [artistName, setArtistName] = useState("");
    const [heroImageUrl, setHeroImageUrl] = useState("");
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Initial Load
    useEffect(() => {
        fetch('/api/bio')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setArtistName(data.artistName || "");
                    setHeroImageUrl(data.heroImageUrl || "");
                    setSocialLinks(data.socialLinks || {});
                    // Merge blocks and layout if needed, but for list sortable we just need order
                    // The API returns blocks and layout.
                    // We'll assume blocks are ordered by list index for this simple builder version.
                    // Or map them.
                    if (data.blocks) {
                        // Sorting by layout order is tricky if simple list.
                        // Let's just use the array order from DB if we saved it in order.
                        setBlocks(data.blocks);
                    }
                }
            });
    }, []);

    const activeBlock = blocks.find(b => b.id === activeBlockId);

    const addBlock = (type: BioBlock['type']) => {
        const newBlock: BioBlock = {
            id: `block-${Date.now()}`,
            type,
            data: {}
        };
        setBlocks(prev => [...prev, newBlock]);
        setActiveBlockId(newBlock.id);
    };

    const updateBlockData = (key: string, value: string) => {
        if (!activeBlockId) return;
        setBlocks(prev => prev.map(b =>
            b.id === activeBlockId ? { ...b, data: { ...b.data, [key]: value } } : b
        ));
    };

    const removeBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
        if (activeBlockId === id) setActiveBlockId(null);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Generate simple layout based on index
            const layout = blocks.map((b, i) => ({
                blockId: b.id,
                x: 0,
                y: i, // simple vertical stack logic for layout order
                w: 12, // full width default
                h: 1,
                order: i
            }));

            const payload = {
                artistName,
                heroImageUrl,
                blocks,
                layout,
                socialLinks
            };

            const token = await import("@/lib/firebase.client").then(m => m.auth.currentUser?.getIdToken());
            // Need to handle auth token properly. 
            // Since this is client comp, auth.currentUser should be available if logged in.

            const res = await fetch('/api/bio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save");
            toast({ title: "Kaydedildi", description: "Biyografi güncellendi." });
        } catch (e: any) {
            toast({ variant: "destructive", title: "Hata", description: e.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            {/* Left Panel: Toolbox */}
            <div className="w-full md:w-64 flex flex-col gap-4 border-r pr-4 overflow-y-auto">
                <h3 className="font-semibold">Bileşenler</h3>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex flex-col h-20 gap-2" onClick={() => addBlock('text')}>
                        <Type className="h-6 w-6" />
                        <span className="text-xs">Metin</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2" onClick={() => addBlock('image')}>
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-xs">Görsel</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2" onClick={() => addBlock('youtube')}>
                        <Youtube className="h-6 w-6" />
                        <span className="text-xs">YouTube</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20 gap-2" onClick={() => addBlock('cta')}>
                        <MousePointerClick className="h-6 w-6" />
                        <span className="text-xs">Buton</span>
                    </Button>
                </div>

                <div className="border-t pt-4 space-y-4">
                    <h3 className="font-semibold">Genel Ayarlar</h3>
                    <div className="grid gap-2">
                        <Label>Sanatçı Adı</Label>
                        <Input value={artistName} onChange={e => setArtistName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Hero Görsel URL</Label>
                        <Input value={heroImageUrl} onChange={e => setHeroImageUrl(e.target.value)} />
                    </div>

                    <h3 className="font-semibold pt-4">Sosyal Medya</h3>
                    <div className="grid gap-2">
                        <Label>YouTube Link</Label>
                        <Input value={socialLinks.youtube || ""} onChange={e => setSocialLinks({ ...socialLinks, youtube: e.target.value })} placeholder="https://youtube.com/..." />
                    </div>
                    <div className="grid gap-2">
                        <Label>Instagram Link</Label>
                        <Input value={socialLinks.instagram || ""} onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="https://instagram.com/..." />
                    </div>
                    <div className="grid gap-2">
                        <Label>Facebook Link</Label>
                        <Input value={socialLinks.facebook || ""} onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })} placeholder="https://facebook.com/..." />
                    </div>
                </div>
            </div>

            {/* Center: Canvas */}
            <div className="flex-1 bg-muted/20 rounded-lg p-6 overflow-y-auto border-2 border-dashed min-h-[500px]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={blocks.map(b => b.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                            {blocks.map(block => (
                                <SortableBlock
                                    key={block.id}
                                    id={block.id}
                                    block={block}
                                    onClick={() => setActiveBlockId(block.id)}
                                    isActive={activeBlockId === block.id}
                                />
                            ))}
                            {blocks.length === 0 && (
                                <div className="text-center text-muted-foreground mt-20">
                                    Soldaki menüden blok ekleyin.
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Right: Properties */}
            <div className="w-full md:w-80 border-l pl-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Özellikler</h3>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </div>

                {activeBlock ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground uppercase">{activeBlock.type} Block</span>
                            <Button variant="destructive" size="sm" onClick={() => removeBlock(activeBlock.id)}>
                                <Trash className="h-4 w-4" /> Sil
                            </Button>
                        </div>

                        {activeBlock.type === 'text' && (
                            <div className="grid gap-2">
                                <Label>Metin İçeriği</Label>
                                <Textarea
                                    rows={8}
                                    value={activeBlock.data.text || ""}
                                    onChange={e => updateBlockData('text', e.target.value)}
                                />
                            </div>
                        )}

                        {activeBlock.type === 'image' && (
                            <div className="grid gap-2">
                                <Label>Görsel URL</Label>
                                <Input
                                    value={activeBlock.data.imageUrl || ""}
                                    onChange={e => updateBlockData('imageUrl', e.target.value)}
                                />
                                {/* File upload could be improved here similar to other forms */}
                            </div>
                        )}

                        {activeBlock.type === 'youtube' && (
                            <div className="grid gap-2">
                                <Label>Video URL</Label>
                                <Input
                                    value={activeBlock.data.youtubeUrl || ""}
                                    onChange={e => updateBlockData('youtubeUrl', e.target.value)}
                                />
                            </div>
                        )}

                        {activeBlock.type === 'cta' && (
                            <>
                                <div className="grid gap-2">
                                    <Label>Buton Metni</Label>
                                    <Input
                                        value={activeBlock.data.ctaLabel || ""}
                                        onChange={e => updateBlockData('ctaLabel', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Hedef URL</Label>
                                    <Input
                                        value={activeBlock.data.ctaUrl || ""}
                                        onChange={e => updateBlockData('ctaUrl', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Başlık (Opsiyonel)</Label>
                                    <Input
                                        value={activeBlock.data.text || ""}
                                        onChange={e => updateBlockData('text', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Düzenlemek için bir blok seçin.
                    </div>
                )}
            </div>
        </div>
    );
}
