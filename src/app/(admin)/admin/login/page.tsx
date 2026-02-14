"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase.client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Resolve username to email
            const res = await fetch('/api/admin/resolve-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Giriş başarısız");
            }

            const email = data.email;

            // 2. Sign in with resolved email
            await signInWithEmailAndPassword(auth, email, password);
            
            // Auth state listener in AdminGuard or elsewhere will handle redirect, 
            // but explicit push is good UX.
            router.push("/admin");
        } catch (error: any) {
            let message = "Giriş başarısız, tekrar deneyin";
            
            // Firebase Auth errors mapping or API errors
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                message = "Şifre hatalı";
            } else if (error.message) {
                message = error.message;
            }

            toast({
                variant: "destructive",
                title: "Giriş Başarısız",
                description: message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Yönetici Girişi</CardTitle>
                    <CardDescription>
                        Admin paneline giriş yapmak için bilgilerinizi girin.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="kullaniciadi"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoCapitalize="none"
                                autoComplete="username"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
