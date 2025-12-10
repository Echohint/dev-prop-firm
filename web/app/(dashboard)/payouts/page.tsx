"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PayoutsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payouts</h1>

            <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                <CardHeader>
                    <CardTitle className="text-emerald-800 dark:text-emerald-400">Ready to request your payout?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                        Please click on the request payout button then proceed to fill out the required information, our team will reach out to you for further advancements.
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Request Payout</Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Payout History</h2>
                <Card>
                    <CardContent className="p-0">
                        <div className="rounded-md border">
                            <div className="grid grid-cols-7 gap-4 p-4 text-xs font-medium text-muted-foreground uppercase bg-muted/50 border-b">
                                <div>REF ID</div>
                                <div>Type</div>
                                <div>Date</div>
                                <div>Method</div>
                                <div>Status</div>
                                <div>Amount</div>
                                <div>Admin Note</div>
                            </div>
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                No data available
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
