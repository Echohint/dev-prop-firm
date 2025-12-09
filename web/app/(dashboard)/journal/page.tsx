"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label"; // Label exists now
import { Plus, Trash2 } from "lucide-react";

export default function JournalPage() {
    const [entries, setEntries] = useState([
        { id: 1, date: "2024-05-10", symbol: "XAUUSD", type: "SELL", outcome: "WIN", profit: 500, logic: "SMC structure break at 15m supply zone." },
        { id: 2, date: "2024-05-11", symbol: "BTCUSD", type: "BUY", outcome: "LOSS", profit: -300, logic: "Failed retest of daily support." },
    ]);

    const [date, setDate] = useState("");
    const [symbol, setSymbol] = useState("");
    const [type, setType] = useState("BUY");
    const [outcome, setOutcome] = useState("WIN");
    const [profit, setProfit] = useState("");
    const [logic, setLogic] = useState("");

    const addEntry = () => {
        const newEntry = {
            id: Date.now(),
            date,
            symbol,
            type,
            outcome,
            profit: Number(profit),
            logic
        };
        setEntries([newEntry, ...entries]);
        setSymbol("");
        setProfit("");
        setLogic("");
    };

    const deleteEntry = (id: number) => {
        setEntries(entries.filter(e => e.id !== id));
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Trading Journal</h1>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Entry Form */}
                <Card className="col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Add New Trade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Date</label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Symbol</label>
                            <Input placeholder="e.g. EURUSD" value={symbol} onChange={e => setSymbol(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Type</label>
                                <select className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={type} onChange={e => setType(e.target.value)}
                                >
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Outcome</label>
                                <select className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={outcome} onChange={e => setOutcome(e.target.value)}
                                >
                                    <option value="WIN">WIN</option>
                                    <option value="LOSS">LOSS</option>
                                    <option value="BE">BE</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Profit/Loss ($)</label>
                            <Input type="number" placeholder="0.00" value={profit} onChange={e => setProfit(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Logic / Notes</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Why did you take this trade?"
                                value={logic} onChange={e => setLogic(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={addEntry}><Plus className="h-4 w-4 mr-2" /> Add Entry</Button>
                    </CardContent>
                </Card>

                {/* Entries List */}
                <div className="col-span-2 space-y-4">
                    {entries.map((entry) => (
                        <Card key={entry.id} className="overflow-hidden">
                            <div className={`h-2 w-full ${entry.outcome === 'WIN' ? 'bg-green-500' : entry.outcome === 'LOSS' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                            <CardContent className="p-4 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg">{entry.symbol}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${entry.type === 'BUY' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                            {entry.type}
                                        </span>
                                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{entry.logic}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-mono font-bold ${entry.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {entry.profit >= 0 ? '+' : ''}${Math.abs(entry.profit)}
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" onClick={() => deleteEntry(entry.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {entries.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                            No journal entries yet. Start logging your trades!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
