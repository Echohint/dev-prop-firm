"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, RefreshCcw, AlertTriangle } from "lucide-react";
import TradingViewWidget from "@/components/ui/TradingViewWidget";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TerminalPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useSWR(id ? `/api/accounts/${id}` : null, fetcher);

    // Add Symbol State
    const [symbol, setSymbol] = useState("NASDAQ:AAPL");
    const [amount, setAmount] = useState(100);
    const [processing, setProcessing] = useState(false);

    const account = data?.account;

    const handleTrade = async (outcome: 'win' | 'loss') => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/accounts/${id}/trade`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outcome, amount: Number(amount), symbol }), // Pass symbol
            });

            if (res.ok) {
                mutate(`/api/accounts/${id}`);
                toast.success(outcome === 'win' ? "Trade Closed in Profit" : "Trade Closed in Loss");
            } else {
                const err = await res.json();
                toast.error(err.error || "Trade failed");
            }
        } catch (e) {
            toast.error("Trade execution error");
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center bg-background h-screen animate-pulse">Loading terminal...</div>;
    if (!account) return <div className="p-8 text-center text-destructive">Account not found.</div>;

    return (
        <div className="space-y-4 h-[calc(100vh-80px)] flex flex-col p-4">
            {/* Header / Stats */}
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold font-mono">#{account.credentials.login}</h1>
                    <div className="flex items-center gap-2">
                        <Input
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            className="w-40 font-mono uppercase bg-background"
                            placeholder="Symbol"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {account.status === 'failed' && (
                        <div className="flex items-center gap-2 text-destructive font-bold bg-destructive/10 px-3 py-1 rounded border border-destructive/20 animate-pulse">
                            <AlertTriangle className="h-4 w-4" />
                            ACCOUNT BREACHED
                        </div>
                    )}
                    <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Equity</div>
                        <div className="text-2xl font-mono font-bold">${account.equity.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Balance</div>
                        <div className="text-2xl font-mono font-bold text-primary">${account.balance.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                {/* Chart Area */}
                <Card className="col-span-12 lg:col-span-9 flex flex-col bg-background/50 border-border relative overflow-hidden p-1 shadow-md">
                    <TradingViewWidget symbol={symbol} />
                </Card>

                {/* Trading Panel */}
                <Card className="col-span-12 lg:col-span-3 flex flex-col shadow-md">
                    <CardHeader>
                        <CardTitle>Execution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Risk Amount ($)</label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="text-lg font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="destructive"
                                className="h-24 flex flex-col gap-1 text-xl font-bold transition-all hover:scale-[1.02]"
                                onClick={() => handleTrade('loss')}
                                disabled={processing || account.status === 'failed'}
                            >
                                <ArrowDown className="h-8 w-8" />
                                SELL
                            </Button>
                            <Button
                                className="h-24 flex flex-col gap-1 text-xl font-bold bg-green-500 hover:bg-green-600 hover:scale-[1.02] transition-all"
                                onClick={() => handleTrade('win')}
                                disabled={processing || account.status === 'failed'}
                            >
                                <ArrowUp className="h-8 w-8" />
                                BUY
                            </Button>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm border">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Daily Loss Limit</span>
                                <span className="font-mono ${account.metrics.currentDailyLoss >= account.metrics.dailyLoss ? 'text-destructive' : ''}">
                                    ${account.metrics.currentDailyLoss.toFixed(2)} / {account.metrics.dailyLoss}
                                </span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-destructive h-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (account.metrics.currentDailyLoss / account.metrics.dailyLoss) * 100)}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-muted-foreground">Max Loss Limit</span>
                                <span className="font-mono ${account.metrics.currentMaxLoss >= account.metrics.maxLoss ? 'text-destructive' : ''}">
                                    ${account.metrics.currentMaxLoss.toFixed(2)} / {account.metrics.maxLoss}
                                </span>
                            </div>
                            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-destructive h-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, (account.metrics.currentMaxLoss / account.metrics.maxLoss) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Logs Area could go here if user requested specific log per session, but we built Journal for that */}
        </div>
    );
}
