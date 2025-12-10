'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Percent, Clock } from "lucide-react";

const ACTIVE_COUPONS = [
    { code: "WELCOME20", discount: "20%", text: "New User Special", color: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
    { code: "PRO50", discount: "50%", text: "Pro Trader Discount", color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { code: "SAVE10", discount: "10%", text: "Seasonal Offer", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
];

export default function CouponsPage() {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Active Coupons</h1>
                <p className="text-muted-foreground">
                    Available discounts for your next challenge purchase.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ACTIVE_COUPONS.map((coupon) => (
                    <Card key={coupon.code} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Ticket className="w-24 h-24 rotate-12" />
                        </div>

                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className={coupon.color}>
                                    {coupon.text}
                                </Badge>
                            </div>
                            <CardTitle className="text-4xl font-bold mt-4 flex items-baseline gap-1">
                                {coupon.discount}
                                <span className="text-lg font-normal text-muted-foreground">OFF</span>
                            </CardTitle>
                            <CardDescription>On any challenge plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-muted rounded-md border border-dashed border-primary/30 flex justify-between items-center">
                                <code className="font-mono text-lg font-bold text-primary">{coupon.code}</code>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Limited time
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Use this code at checkout to apply discount immediately.
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
