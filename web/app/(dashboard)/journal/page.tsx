'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar'; // Shadcn calendar
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Mock data for initial render (replace with API fetch)
const MOCK_ENTRIES = {
    '2024-12-08': { pnl: 250, notes: 'Great scalp on Gold. Followed rules.' },
    '2024-12-09': { pnl: -120, notes: 'Chased the pump. Bad discipline.' },
    '2024-12-10': { pnl: 450, notes: 'Recovery day. Stuck to high probability setups.' },
};

export default function JournalPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [note, setNote] = useState('');

    // Derived state for the selected day
    const dateStr = date?.toISOString().split('T')[0] || '';
    const entry = MOCK_ENTRIES[dateStr as keyof typeof MOCK_ENTRIES];

    const handleSave = () => {
        // Here we would call API to save note
        toast.success(`Journal saved for ${dateStr}`);
    };

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* Left: Calendar & Stats */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trading Journal</h1>
                    <p className="text-muted-foreground">Track your performance and psychology.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                profit: (d) => {
                                    const s = d.toISOString().split('T')[0];
                                    return (MOCK_ENTRIES as any)[s]?.pnl > 0;
                                },
                                loss: (d) => {
                                    const s = d.toISOString().split('T')[0];
                                    return (MOCK_ENTRIES as any)[s]?.pnl < 0;
                                }
                            }}
                            modifiersStyles={{
                                profit: { backgroundColor: 'var(--primary)', color: 'black', fontWeight: 'bold' },
                                loss: { backgroundColor: 'var(--destructive)', color: 'white', fontWeight: 'bold' }
                            }}
                        />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Monthly P&L</div>
                            <div className="text-2xl font-bold text-green-500">+$580.00</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">Win Rate</div>
                            <div className="text-2xl font-bold">66%</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right: Daily Entry */}
            <div className="flex flex-col h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            Entry for {date?.toLocaleDateString()}
                        </CardTitle>
                        {entry && (
                            <Badge variant={entry.pnl >= 0 ? 'default' : 'destructive'} className="text-lg">
                                {entry.pnl >= 0 ? '+' : ''}${entry.pnl}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Daily Reflection & Notes</label>
                            <Textarea
                                placeholder="How did you feel today? Did you follow your plan?"
                                className="h-full resize-none p-4 text-lg"
                                value={note || entry?.notes || ''}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setNote('')}>Clear</Button>
                            <Button onClick={handleSave}>Save Entry</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
