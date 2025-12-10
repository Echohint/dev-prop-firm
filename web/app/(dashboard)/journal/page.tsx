'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar'; // Shadcn calendar
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ... imports
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JournalPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [note, setNote] = useState('');
    const [mood, setMood] = useState<'happy' | 'neutral' | 'frustrated' | 'tilted'>('neutral');

    const { data: entriesData } = useSWR('/api/journal', fetcher);

    // Derived state for the selected day
    const dateStr = date?.toISOString().split('T')[0] || '';

    const { data: dayEntryData, mutate: mutateDay } = useSWR(dateStr ? `/api/journal?date=${dateStr}` : null, fetcher);
    const entry = dayEntryData?.entry;

    // Map entries for calendar modifiers
    const entriesMap: Record<string, any> = {};
    entriesData?.entries?.forEach((e: any) => {
        entriesMap[e.date] = e;
    });

    const handleSave = async () => {
        try {
            const res = await fetch('/api/journal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr, notes: note, mood })
            });

            if (res.ok) {
                toast.success(`Journal saved for ${dateStr}`);
                mutateDay(); // Refresh day entry
                mutate('/api/journal'); // Refresh calendar
            }
        } catch (e) {
            toast.error("Failed to save journal");
        }
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
                                    return entriesMap[s]?.totalPnl > 0;
                                },
                                loss: (d) => {
                                    const s = d.toISOString().split('T')[0];
                                    return entriesMap[s]?.totalPnl < 0;
                                }
                            }}
                            modifiersStyles={{
                                profit: { backgroundColor: 'var(--primary)', color: 'black', fontWeight: 'bold' },
                                loss: { backgroundColor: 'var(--destructive)', color: 'white', fontWeight: 'bold' }
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Stats cards (could be dynamic later) */}
                <div className="grid grid-cols-2 gap-4">
                    {/* ... stats ... */}
                </div>
            </div>

            {/* Right: Daily Entry */}
            <div className="flex flex-col h-full">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            Entry for {date?.toLocaleDateString()}
                        </CardTitle>
                        {entry && entry.totalPnl !== 0 && (
                            <Badge variant={entry.totalPnl >= 0 ? 'default' : 'destructive'} className="text-lg">
                                {entry.totalPnl >= 0 ? '+' : ''}${entry.totalPnl}
                            </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Daily Reflection & Notes</label>
                            <Textarea
                                placeholder="How did you feel today? Did you follow your plan?"
                                className="h-full resize-none p-4 text-lg"
                                defaultValue={entry?.notes || ''}
                                onChange={(e) => setNote(e.target.value)}
                                key={dateStr} // Force re-render on date change
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleSave}>Save Entry</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
