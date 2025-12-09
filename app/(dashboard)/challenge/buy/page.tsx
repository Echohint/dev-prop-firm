"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Check, Bitcoin, Coins, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BuyChallengePage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const challenges = [
        { type: "10K Challenge", amount: 10000, price: 99 },
        { type: "25K Challenge", amount: 25000, price: 199 },
        { type: "50K Challenge", amount: 50000, price: 299 },
        { type: "100K Challenge", amount: 100000, price: 499 },
    ];

    const handleBuy = async (challenge: any) => {
        setLoading(challenge.type);

        // Redirect to Razorpay payment link in new tab
        window.open("https://razorpay.me/@devtrader", "_blank");

        // In a real app, we would wait for a webhook. 
        // Here, we'll simulate "verification" after they come back or click "I've Paid".
        // Let's prompt them:
        const confirm = window.confirm("Did you complete the payment on Razorpay? Click OK to activate your account.");

        if (confirm) {
            try {
                const res = await fetch("/api/challenges/purchase", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Sending amount to backend to create the account
                    body: JSON.stringify({ type: challenge.type, amount: challenge.amount }),
                });

                if (res.ok) {
                    router.push("/accounts");
                    router.refresh();
                } else {
                    alert("Failed to activate challenge. Please contact support.");
                }
            } catch (e) {
                alert("Error creating account");
            }
        }
        setLoading(null);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start Your Journey</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Choose your asset class and account size.
                </p>
            </div>

            <Tabs defaultValue="forex" className="w-full">
                <div className="flex justify-center mb-8">
                    <TabsList className="grid w-full max-w-md grid-cols-3">
                        <TabsTrigger value="forex" className="gap-2"><TrendingUp className="h-4 w-4" /> Forex</TabsTrigger>
                        <TabsTrigger value="crypto" className="gap-2"><Bitcoin className="h-4 w-4" /> Crypto</TabsTrigger>
                        <TabsTrigger value="metal" className="gap-2"><Coins className="h-4 w-4" /> Metal</TabsTrigger>
                    </TabsList>
                </div>

                {["forex", "crypto", "metal"].map((category) => (
                    <TabsContent key={category} value={category}>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {challenges.map((challenge) => (
                                <Card key={`${category}-${challenge.type}`} className="flex flex-col border-primary/20 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all">
                                    <CardHeader>
                                        <CardTitle>{challenge.type}</CardTitle>
                                        <CardDescription>Capital: ${challenge.amount.toLocaleString()}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="text-3xl font-bold mb-4">${challenge.price}</div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {category === 'forex' ? 'Major Pairs' : category === 'crypto' ? 'Top 50 Cryptos' : 'Gold & Silver'}</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Profit Split up to 90%</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5% Daily Loss Limit</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 10% Max Loss Limit</li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleBuy(challenge)}
                                            disabled={!!loading}
                                        >
                                            {loading === challenge.type ? "Processing..." : "Select & Pay"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="bg-muted/30 p-4 rounded-lg text-center text-sm text-muted-foreground mt-8">
                <p>Accepted Payment Methods</p>
                <div className="flex justify-center gap-4 mt-2 font-semibold">
                    <span>UPI</span>
                    <span>Razorpay</span>
                    <span>Credit Card</span>
                    <span>NetBanking</span>
                </div>
            </div>
        </div>
    );
}
