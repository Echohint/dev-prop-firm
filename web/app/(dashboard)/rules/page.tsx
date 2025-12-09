"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Target, AlertTriangle, Calendar } from "lucide-react";

export default function RulesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Trading Rules</h1>
                <p className="text-muted-foreground">Master these objectives to get funded.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profit Target</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10%</div>
                        <p className="text-xs text-muted-foreground">Reach this equity target to pass.</p>
                        <Progress value={10} className="mt-3 h-2" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Max Daily Loss</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5%</div>
                        <p className="text-xs text-muted-foreground">Based on previous day's equity.</p>
                        <Progress value={5} className="mt-3 h-2 bg-orange-100" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Max Overall Loss</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10%</div>
                        <p className="text-xs text-muted-foreground">Fixed from initial balance.</p>
                        <Progress value={10} className="mt-3 h-2 bg-red-100" />
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Min Trading Days</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5 Days</div>
                        <p className="text-xs text-muted-foreground">Minimum active trading days.</p>
                        <Progress value={100} className="mt-3 h-2 bg-green-100" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold">Can I hold trades over the weekend?</h3>
                            <p className="text-sm text-muted-foreground">Yes, weekend holding is allowed on Swing accounts.</p>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold">Is EA trading allowed?</h3>
                            <p className="text-sm text-muted-foreground">Yes, as long as it is not a tick scalper or arbitrage bot.</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Prohibited Strategies</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
                            <li>High Frequency Trading (HFT)</li>
                            <li>Latency Arbitrage</li>
                            <li>Account Sharing / Management Services</li>
                            <li>Reverse Trading between accounts</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
