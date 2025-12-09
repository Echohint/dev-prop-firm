"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, RefreshCcw, AlertTriangle } from "lucide-react";
import TradingViewWidget from "@/components/ui/TradingViewWidget";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TerminalPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useSWR(id ? `/api/accounts/${id}` : null, fetcher); // Use a dedicated route or filter?
    // Reuse /api/accounts logic but filtered? Or fetch all client side (not efficient but okay for demo).
    // Or created specific route /api/accounts/[id]

    const [amount, setAmount] = useState(100);
    const [processing, setProcessing] = useState(false);

    // Fallback: fetch all and find (since I didn't make single account endpoint yet, I will make it now)
    const account = data?.account;

    const handleTrade = async (outcome: 'win' | 'loss') => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/accounts/${id}/trade`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outcome, amount: Number(amount) }),
            });

            if (res.ok) {
                mutate(`/api/accounts/${id}`); // Refresh data
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (e) {
            alert("Trade failed");
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center bg-background h-screen">Loading terminal...</div>;
    if (!account) return <div className="p-8 text-center text-destructive">Account not found.</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    Terminal <span className="text-sm font-normal text-muted-foreground font-mono">#{account.credentials.login}</span>
                </h1>
                <div className="flex items-center gap-4">
                    {account.status === 'failed' && (
                        <div className="flex items-center gap-2 text-destructive font-bold bg-destructive/10 px-3 py-1 rounded">
                            <AlertTriangle className="h-4 w-4" />
                            ACCOUNT BREECHED
                        </div>
                    )}
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Equity</div>
                        <div className="text-xl font-mono font-bold">${account.equity.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Balance</div>
                        <div className="text-xl font-mono font-bold text-primary">${account.balance.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 flex-1">
                {/* Chart Area */}
                <Card className="col-span-9 flex flex-col bg-background/50 border-border relative overflow-hidden p-1">
                    <TradingViewWidget />
                </Card>

                {/* Trading Panel */}
                <Card className="col-span-3 flex flex-col">
                    <CardHeader>
                        <CardTitle>Trade Execution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Risk Amount ($)</label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="destructive"
                                className="h-20 flex flex-col gap-1 text-lg"
                                onClick={() => handleTrade('loss')}
                                disabled={processing || account.status === 'failed'}
                            >
                                <ArrowDown className="h-6 w-6" />
                                SELL
                            </Button>
                            <Button
                                className="h-20 flex flex-col gap-1 text-lg bg-green-500 hover:bg-green-600"
                                onClick={() => handleTrade('win')}
                                disabled={processing || account.status === 'failed'}
                            >
                                <ArrowUp className="h-6 w-6" />
                                BUY
                            </Button>
                        </div>

                        <div className="rounded-lg bg-muted p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Daily Loss:</span>
                                <span className="text-destructive font-mono">${account.metrics.currentDailyLoss.toFixed(2)} / {account.metrics.dailyLoss}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Max Loss:</span>
                                <span className="text-destructive font-mono">${account.metrics.currentMaxLoss.toFixed(2)} / {account.metrics.maxLoss}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="uppercase font-bold">{account.status}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
