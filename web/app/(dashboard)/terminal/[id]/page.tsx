"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, RefreshCcw, AlertTriangle, Info, Maximize, CheckSquare, Square } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TradingViewWidget from "@/components/ui/TradingViewWidget";
import GoChartingWidget from "@/components/ui/GoChartingWidget";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TerminalPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data, error, isLoading } = useSWR(id ? `/api/accounts/${id}` : null, fetcher, { refreshInterval: 5000 });

    // State
    const [symbol, setSymbol] = useState("NASDAQ:AAPL");
    const [leverage, setLeverage] = useState("10");
    const [inputType, setInputType] = useState<'USD' | 'UNITS'>('USD');
    const [inputValue, setInputValue] = useState(1000); // Default input
    const [sl, setSl] = useState("");
    const [tp, setTp] = useState("");
    const [processing, setProcessing] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(150.00);
    const [oneClickTrading, setOneClickTrading] = useState(false);
    const [confirmTrade, setConfirmTrade] = useState<{ type: 'BUY' | 'SELL' } | null>(null);

    // Derived logic for Amount (Margin) vs Units
    // Margin = (Price * Units) / Leverage
    // Units = (Margin * Leverage) / Price
    const numericLev = Number(leverage);

    // Calculate effective margin to send to API (API expects Margin in 'amount')
    let effectiveMargin = 0;
    let effectiveUnits = 0;

    if (inputType === 'USD') {
        effectiveMargin = inputValue;
        effectiveUnits = (effectiveMargin * numericLev) / currentPrice;
    } else {
        effectiveUnits = inputValue;
        effectiveMargin = (effectiveUnits * currentPrice) / numericLev;
    }

    // Ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => {
                const change = (Math.random() - 0.5) * 0.5;
                return Number((prev + change).toFixed(2));
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const account = data?.account;
    const trades = data?.trades || [];

    // Redirect if breached
    useEffect(() => {
        if (account?.status === 'failed') {
            toast.error("Account Breached! Redirecting...");
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    }, [account?.status, router]);

    // Calculate Stats
    // Assuming 'trades' contains OPEN trades.
    let usedMargin = 0;
    let floatingPnL = 0;

    trades.forEach((trade: any) => {
        // Recalculate margin used for each trade: amount is Margin
        usedMargin += trade.amount;

        // PnL
        const entry = trade.entryPrice;
        const mark = currentPrice; // Mock PnL based on global ticker (simplified)
        // Ideally should check symbol, but for demo we assume 1 symbol or just use same price
        if (trade.symbol === symbol) {
            const vol = (trade.amount * trade.leverage) / entry;
            if (trade.type === 'BUY') floatingPnL += (mark - entry) * vol;
            else floatingPnL += (entry - mark) * vol;
        }
    });

    // If account not loaded, defaults
    if (!account) return <div className="p-8 text-center text-destructive">Account not found.</div>;

    const equity = account.balance + floatingPnL;
    const freeMargin = equity - usedMargin;
    const marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 0;

    const executeTrade = async (type: 'BUY' | 'SELL') => {
        setProcessing(true);
        setConfirmTrade(null); // Close modal if open
        try {
            if (effectiveMargin > freeMargin) {
                toast.error("Insufficient Free Margin");
                return;
            }

            const res = await fetch(`/api/accounts/${id}/trade`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    amount: Number(effectiveMargin.toFixed(2)), // Send Margin
                    symbol,
                    sl: sl ? Number(sl) : undefined,
                    tp: tp ? Number(tp) : undefined,
                    leverage: numericLev,
                    price: currentPrice
                }),
            });

            if (res.ok) {
                mutate(`/api/accounts/${id}`);
                const data = await res.json();
                toast.success(data.message || "Order Placed");
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

    const handleTradeClick = (type: 'BUY' | 'SELL') => {
        if (oneClickTrading) {
            executeTrade(type);
        } else {
            setConfirmTrade({ type });
        }
    };

    const handleCloseTrade = async (tradeId: string) => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/trades/${tradeId}/close`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    exitPrice: currentPrice
                }),
            });

            if (res.ok) {
                mutate(`/api/accounts/${id}`);
                toast.success("Trade Closed");
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to close trade");
            }
        } catch (e) {
            toast.error("Error closing trade");
        } finally {
            setProcessing(false);
        }
    };

    const handleRequestPayout = async () => {
        // ... existing logic ...
        toast.success("Payout Requested");
    };

    if (isLoading) return <div className="p-8 text-center bg-background h-screen animate-pulse">Loading terminal...</div>;

    // Helper to format currency
    const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="space-y-4 h-[calc(100vh-80px)] flex flex-col p-4">
            {/* Header / Stats */}
            <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold font-mono">Challenge #{account.credentials.login}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded ${account.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {account.status.toUpperCase()}
                                </span>
                                <span className="text-xs text-muted-foreground">{account.planType}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={symbol}
                                onChange={e => setSymbol(e.target.value.toUpperCase())}
                                className="w-32 font-mono uppercase h-8"
                            />
                            <div className="text-xl font-mono font-bold text-primary animate-pulse w-24 text-right">
                                {currentPrice.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                            }}
                        >
                            <Maximize className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-2"
                            onClick={() => window.open(`https://gocharting.com/terminal?ticker=${symbol}`, '_blank')}
                        >
                            Open GoCharting ↗
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2 border-t text-sm">
                    <div>
                        <div className="text-muted-foreground text-xs">Balance</div>
                        <div className="font-mono font-medium">${fmt(account.balance)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Equity</div>
                        <div className="font-mono font-medium">${fmt(equity)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Used Margin</div>
                        <div className="font-mono font-medium">${fmt(usedMargin)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Free Margin</div>
                        <div className="font-mono font-medium">${fmt(freeMargin)}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Margin Level</div>
                        <div className={`font-mono font-medium ${marginLevel < 100 ? 'text-red-500' : 'text-green-500'}`}>
                            {marginLevel === 0 && usedMargin === 0 ? 'Infinite' : `${fmt(marginLevel)}%`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
                {/* Chart Area */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-4">
                    <Card className="flex-1 bg-background/50 border-border relative overflow-hidden p-1 shadow-md">
                        <TradingViewWidget symbol={symbol} />
                    </Card>

                    {/* Positions / History Tabs */}
                    <Card className="h-72 overflow-hidden flex flex-col">
                        <Tabs defaultValue="positions" className="flex-1 flex flex-col">
                            <div className="border-b px-4 bg-muted/30">
                                <TabsList className="bg-transparent h-10 p-0">
                                    <TabsTrigger value="positions" className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full rounded-t-sm px-4">Positions</TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full rounded-t-sm px-4">History</TabsTrigger>
                                    <TabsTrigger value="orders" className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary h-full rounded-t-sm px-4">Orders</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="positions" className="flex-1 overflow-auto p-0 m-0">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted text-muted-foreground sticky top-0">
                                        <tr>
                                            <th className="p-2 text-left">Symbol</th>
                                            <th className="p-2 text-left">Type</th>
                                            <th className="p-2 text-right">Vol</th>
                                            <th className="p-2 text-right">Entry</th>
                                            <th className="p-2 text-right">Market</th>
                                            <th className="p-2 text-right">Margin</th>
                                            <th className="p-2 text-right">PnL</th>
                                            <th className="p-2 text-right">Close</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trades.map((trade: any) => {
                                            const entry = trade.entryPrice;
                                            const mark = currentPrice;
                                            let pnl = 0;
                                            const vol = (trade.amount * trade.leverage) / entry;
                                            if (trade.symbol === symbol) {
                                                if (trade.type === 'BUY') pnl = (mark - entry) * vol;
                                                else pnl = (entry - mark) * vol;
                                            }
                                            return (
                                                <tr key={trade._id} className="border-b hover:bg-muted/50">
                                                    <td className="p-2 font-mono">{trade.symbol}</td>
                                                    <td className={`p-2 font-bold ${trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{trade.type}</td>
                                                    <td className="p-2 text-right">{vol.toFixed(2)}</td>
                                                    <td className="p-2 text-right">{trade.entryPrice.toFixed(2)}</td>
                                                    <td className="p-2 text-right">{trade.symbol === symbol ? mark.toFixed(2) : '-'}</td>
                                                    <td className="p-2 text-right">${trade.amount.toFixed(2)}</td>
                                                    <td className={`p-2 text-right font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {trade.symbol === symbol ? pnl.toFixed(2) : '...'}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCloseTrade(trade._id)}>X</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {trades.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No open positions</td></tr>}
                                    </tbody>
                                </table>
                            </TabsContent>

                            <TabsContent value="history" className="flex-1 p-8 text-center text-muted-foreground">
                                No closed trades yet.
                            </TabsContent>
                            <TabsContent value="orders" className="flex-1 p-8 text-center text-muted-foreground">
                                No pending orders.
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Execution Panel */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                    {/* Execution Panel Refactored to match "Pro" look */}
                    <Card className="flex flex-col shadow-md overflow-hidden">
                        <div className="flex border-b bg-muted/20">
                            <button className="flex-1 py-2 text-sm font-medium border-b-2 border-primary bg-background">Market</button>
                            <button className="flex-1 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/30">Pending</button>
                        </div>

                        <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-xs font-semibold text-muted-foreground">{symbol}</span>
                                <div
                                    className="flex items-center gap-1 cursor-pointer text-xs"
                                    onClick={() => setOneClickTrading(!oneClickTrading)}
                                >
                                    {oneClickTrading ? <CheckSquare className="h-3 w-3 text-green-500" /> : <Square className="h-3 w-3" />}
                                    <span className="opacity-80">One-Click</span>
                                </div>
                            </div>

                            {/* Symbol Info Compact */}
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground border-b pb-2">
                                <div className="flex justify-between"><span>Spread</span> <span className="font-mono text-foreground">0.02</span></div>
                                <div className="flex justify-between"><span>Pip Value</span> <span className="font-mono text-foreground">1.00</span></div>
                            </div>

                            {/* Volume Input */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Volume</span>
                                    <div className="flex gap-1">
                                        <span
                                            className={`cursor-pointer ${inputType === 'UNITS' && 'text-primary font-bold'}`}
                                            onClick={() => setInputType('UNITS')}
                                        >Units</span>
                                        <span>|</span>
                                        <span
                                            className={`cursor-pointer ${inputType === 'USD' && 'text-primary font-bold'}`}
                                            onClick={() => setInputType('USD')}
                                        >Margin</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setInputValue(prev => Math.max(0, prev - (inputType === 'USD' ? 100 : 0.1)))}>-</Button>
                                    <Input
                                        type="number"
                                        value={inputValue}
                                        onChange={e => setInputValue(Number(e.target.value))}
                                        className="h-9 text-center font-mono"
                                    />
                                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setInputValue(prev => prev + (inputType === 'USD' ? 100 : 0.1))}>+</Button>
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                                    <span>Margin: ${effectiveMargin.toFixed(0)}</span>
                                    <span>Size: {effectiveUnits.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Leverage */}
                            <div className="space-y-1">
                                <label className="text-[10px] text-muted-foreground">Leverage</label>
                                <select
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-mono"
                                    value={leverage}
                                    onChange={(e) => setLeverage(e.target.value)}
                                >
                                    {[1, 5, 10, 25, 50, 100, 200].map(l => <option key={l} value={l}>{l}x</option>)}
                                </select>
                            </div>

                            {/* SL/TP */}
                            <div className="space-y-2 pt-2 border-t">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span>Stop Loss</span>
                                            <span className="text-muted-foreground cursor-pointer hover:text-primary">X</span>
                                        </div>
                                        <Input placeholder="Price" value={sl} onChange={e => setSl(e.target.value)} className="h-8 font-mono text-xs" />
                                        <div className="text-[10px] text-red-500 text-right">-100 pips</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-[10px]">
                                            <span>Take Profit</span>
                                            <span className="text-muted-foreground cursor-pointer hover:text-primary">X</span>
                                        </div>
                                        <Input placeholder="Price" value={tp} onChange={e => setTp(e.target.value)} className="h-8 font-mono text-xs" />
                                        <div className="text-[10px] text-green-500 text-right">+200 pips</div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button
                                    variant="destructive"
                                    className="h-12 flex flex-col items-center justify-center gap-0.5 shadow-sm"
                                    onClick={() => handleTradeClick('SELL')}
                                    disabled={processing || account.status === 'failed'}
                                >
                                    <span className="text-lg font-bold">SELL</span>
                                    <span className="text-[10px] opacity-90 font-mono">{(currentPrice - 0.02).toFixed(2)}</span>
                                </Button>
                                <Button
                                    className="h-12 flex flex-col items-center justify-center gap-0.5 bg-blue-600 hover:bg-blue-700 shadow-sm"
                                    onClick={() => handleTradeClick('BUY')}
                                    disabled={processing || account.status === 'failed'}
                                >
                                    <span className="text-lg font-bold">BUY</span>
                                    <span className="text-[10px] opacity-90 font-mono">{(currentPrice + 0.02).toFixed(2)}</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compact Account Health */}
                    <Card className="flex-1 bg-background shadow-sm border text-xs">
                        <CardContent className="p-3 space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-muted-foreground">Daily Loss</span>
                                    <span className="font-mono">${account.metrics.currentDailyLoss.toFixed(2)} / ${account.metrics.dailyLoss}</span>
                                </div>
                                <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full" style={{ width: `${(account.metrics.currentDailyLoss / account.metrics.dailyLoss) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-muted-foreground">Max Loss</span>
                                    <span className="font-mono">${account.metrics.currentMaxLoss.toFixed(2)} / ${account.metrics.maxLoss}</span>
                                </div>
                                <div className="w-full bg-secondary h-1 rounded-full overflow-hidden">
                                    <div className="bg-red-500 h-full" style={{ width: `${(account.metrics.currentMaxLoss / account.metrics.maxLoss) * 100}%` }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AlertDialog open={!!confirmTrade} onOpenChange={() => setConfirmTrade(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Trade</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {confirmTrade?.type} {effectiveUnits.toFixed(2)} units of {symbol}?
                            <br />
                            Estimated Margin: ${effectiveMargin.toFixed(2)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => confirmTrade && executeTrade(confirmTrade.type)}>
                            Confirm Execution
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
