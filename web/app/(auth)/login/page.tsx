"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError("An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="w-full max-w-md p-8 mx-4 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl relative animate-in zoom-in-95 duration-500 z-10">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative space-y-8">
                    <div className="text-center space-y-2">
                        <div className="h-16 w-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-1">Welcome Back</h1>
                        <p className="text-sm text-muted-foreground">Access your trading dashboard.</p>
                    </div>

                    {message === "registered" && (
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center animate-in fade-in slide-in-from-top-2">
                            Account created! You can now log in.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 h-12"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 group"
                            disabled={loading}
                        >
                            {loading ? "Authenticating..." : (
                                <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground pt-4 border-t border-white/5">
                        New to Dev Prop Firm?{" "}
                        <Link href="/register" className="text-white font-medium hover:text-primary transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
