import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LockKeyhole } from "lucide-react"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-lg">
                            ARTIST
                        </Link>
                        <nav className="flex items-center gap-6 text-sm font-medium">
                            <Link href="/bio" className="transition-colors hover:text-foreground/80 text-foreground/60">Biyografi</Link>
                            <Link href="/projects" className="transition-colors hover:text-foreground/80 text-foreground/60">Projeler</Link>
                            <Link href="/announcements" className="transition-colors hover:text-foreground/80 text-foreground/60">Duyurular</Link>
                        </nav>
                    </div>
                    {/* Mobile Nav could be added here */}
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <Button variant="ghost" size="icon" asChild title="Yönetici Girişi">
                            <Link href="/admin/login">
                                <LockKeyhole className="h-4 w-4 text-muted-foreground/50 hover:text-foreground" />
                                <span className="sr-only">Yönetici Girişi</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sanatçı Adı. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
}
