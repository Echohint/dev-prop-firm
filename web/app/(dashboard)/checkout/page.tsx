'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RazorpayButton from '@/components/checkout/razorpay-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'Standard Challenge';
    const priceUSD = parseFloat(searchParams.get('price') || '100');

    // Approximate conversion for display (Backend handles actual charge)
    const exchangeRate = 86.5;
    const priceINR = Math.round(priceUSD * exchangeRate);

    return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">

            {/* Left Side: Product Info */}
            <div className="space-y-6">
                <div>
                    <Link href="/challenges" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Challenges
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Complete your purchase</h1>
                    <p className="text-muted-foreground text-lg">
                        Unlock your potential with our {plan}. Instant access logic included.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Secure Payment</h3>
                            <p className="text-sm text-muted-foreground">Your transaction is protected by 256-bit SSL encryption.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card/50 backdrop-blur-sm">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">Instant Activation</h3>
                            <p className="text-sm text-muted-foreground">Get your credentials immediately after payment.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Payment Card */}
            <Card className="w-full shadow-2xl border-primary/20 bg-background/80 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="px-3 py-1">Order Summary</Badge>
                        <span className="font-mono text-xs text-muted-foreground">ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                    <CardTitle className="text-2xl">{plan}</CardTitle>
                    <CardDescription>One-time payment for challenge account</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subtotal (USD)</span>
                        <span className="font-medium">${priceUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Exchange Rate</span>
                        <span className="font-medium text-xs">1 USD ≈ ₹{exchangeRate}</span>
                    </div>
                    <div className="h-px bg-border" />

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-muted-foreground">Total (INR)</p>
                            <p className="text-3xl font-bold text-primary">₹{priceINR.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground line-through">${priceUSD}</p>
                        </div>
                    </div>

                    <RazorpayButton amount={priceUSD} currency="USD" />
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-xs text-muted-foreground text-center">
                        By proceeding, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/50 to-background">
            <Suspense fallback={<div>Loading...</div>}>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
