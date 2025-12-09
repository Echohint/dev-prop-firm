"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Rocket, Zap, Globe, Shield } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/login?message=registered");
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 z-10">
                {/* Left Side: Hero Content */}
                <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border/30 border border-white/10 backdrop-blur-md text-xs font-mono text-primary animate-in fade-in slide-in-from-left-4 duration-500">
                            <Rocket className="h-3 w-3" />
                            <span>LAUNCH YOUR TRADING CAREER</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            DEV PROP FIRM.
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                            Join the elite circle of funded traders. Access up to <span className="text-white font-bold">$100k</span> in capital with industry-leading conditions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                            <h3 className="font-bold text-white">Instant Funding</h3>
                            <p className="text-xs text-gray-400 mt-1">No waiting periods.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Globe className="h-6 w-6 text-blue-400 mb-2" />
                            <h3 className="font-bold text-white">Global Access</h3>
                            <p className="text-xs text-gray-400 mt-1">Trade from anywhere.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <Shield className="h-6 w-6 text-green-400 mb-2" />
                            <h3 className="font-bold text-white">Secure Capital</h3>
                            <p className="text-xs text-gray-400 mt-1">Rank-1 liquidity.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Glass Form */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl relative animate-in zoom-in-95 duration-500">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                        <div className="relative space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                                <p className="text-sm text-muted-foreground">Enter your details to get started.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-gray-500 h-11"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Profile..." : "Sign Up Now"}
                                </Button>
                            </form>

                            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-white/5">
                                Already a trader?{" "}
                                <Link href="/login" className="text-white font-medium hover:text-primary transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
