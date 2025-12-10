'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, DollarSign, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AffiliatePage() {
    const [copied, setCopied] = useState(false);
    const referralLink = "https://devpropfirm.com/ref/devsoniyata"; // Mock link

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Affiliate Program
                </h1>
                <p className="text-muted-foreground">
                    Invite traders and earn up to 15% commission on every challenge they purchase.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,250.00</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">+4 active now</p>
                    </CardContent>
                </Card>
            </div>

            {/* Link Section */}
            <Card className="border-primary/20 bg-gradient-to-br from-background via-muted/20 to-background">
                <CardHeader>
                    <CardTitle>Your Referral Link</CardTitle>
                    <CardDescription>
                        Share this link with your network. You get paid when they start a challenge.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <div className="flex-1">
                        <Input readOnly value={referralLink} className="bg-background/50" />
                    </div>
                    <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                        <Copy className="h-4 w-4" />
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Activity Mockup */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Referrals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        U{i}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium leading-none">New User {i}</p>
                                        <p className="text-sm text-muted-foreground">Joined via link</p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium">+$25.00</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
