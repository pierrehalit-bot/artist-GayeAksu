import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Official Artist Website",
        template: "%s | Artist Name"
    },
    description: "Stay tuned for upcoming releases, projects, and announcements from Artist Name.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    openGraph: {
        title: "Official Artist Website",
        description: "Stay tuned for upcoming releases and projects.",
        url: "/",
        siteName: "Artist Website",
        locale: "tr_TR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Official Artist Website",
        description: "Stay tuned for upcoming releases and projects.",
    },
    robots: {
        index: true,
        follow: true,
    }
};

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
