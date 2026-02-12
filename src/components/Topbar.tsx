"use client";

import { ModeToggle } from "./ModeToggle";

export default function Topbar() {
    return (
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
            <div className="font-medium">Welcome Back</div>
            <div className="flex items-center gap-4">
                {/* <ModeToggle /> - can add theme toggle later if requested */}
            </div>
        </header>
    );
}
