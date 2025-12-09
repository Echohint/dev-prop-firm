"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Crown } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LeaderboardPage() {
    const { data, isLoading } = useSWR("/api/leaderboard", fetcher);
    const leaders = data?.leaderboard || [];

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">Top traders of the month</p>
            </div>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Best Accounts In Profit</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Loading rankings...</div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-muted-foreground borther-b pb-2 px-2 uppercase tracking-wide">
                                <div className="col-span-1 text-center">Rank</div>
                                <div className="col-span-4">User</div>
                                <div className="col-span-3 text-right">Account Size</div>
                                <div className="col-span-2 text-right">Profit</div>
                                <div className="col-span-2 text-right">Profit %</div>
                            </div>
                            {leaders.map((leader: any) => (
                                <div key={leader.rank} className="grid grid-cols-12 gap-4 items-center bg-accent/20 rounded-lg p-3 hover:bg-accent/40 transition-colors">
                                    <div className="col-span-1 flex justify-center">
                                        {leader.rank === 1 ? <Crown className="h-6 w-6 text-yellow-500" /> :
                                            leader.rank === 2 ? <Medal className="h-6 w-6 text-gray-400" /> :
                                                leader.rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> :
                                                    <span className="font-bold text-muted-foreground">#{leader.rank}</span>}
                                    </div>
                                    <div className="col-span-4 font-medium flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {leader.user.substring(0, 2).toUpperCase()}
                                        </div>
                                        {leader.user}
                                    </div>
                                    <div className="col-span-3 text-right text-muted-foreground">
                                        {leader.accountSize}
                                    </div>
                                    <div className="col-span-2 text-right font-medium text-green-500">
                                        {leader.profit}
                                    </div>
                                    <div className="col-span-2 text-right font-medium text-green-500">
                                        {leader.profitPercent}
                                    </div>
                                </div>
                            ))}
                            {leaders.length === 0 && <div className="text-center py-8 text-muted-foreground">No data available</div>}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
