import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Resmi Sanatçı Websitesi",
        template: "%s | Sanatçı Adı"
    },
    description: "Sanatçı Adı'ndan yaklaşan yayınlar, projeler ve duyurular için takipte kalın.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    openGraph: {
        title: "Resmi Sanatçı Websitesi",
        description: "Yaklaşan yayınlar ve projeler için takipte kalın.",
        url: "/",
        siteName: "Sanatçı Websitesi",
        locale: "tr_TR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Resmi Sanatçı Websitesi",
        description: "Yaklaşan yayınlar ve projeler için takipte kalın.",
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
        <html lang="tr" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
