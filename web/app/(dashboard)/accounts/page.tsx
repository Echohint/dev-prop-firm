"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AccountsPage() {
    const { data, error, isLoading } = useSWR("/api/accounts", fetcher);

    if (isLoading) return <div className="p-8 text-center">Loading accounts...</div>;
    if (error) return <div className="p-8 text-center text-destructive">Failed to load accounts.</div>;

    const accounts = data?.accounts || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Accounts</h1>
                <Link href="/challenge/buy">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Challenge
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {accounts.length === 0 ? (
                    <Card className="flex min-h-[300px] flex-col items-center justify-center border-dashed p-8 text-center animate-in fade-in-50">
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-muted p-4">
                                <Link href="/challenge/buy"><Plus className="h-8 w-8 text-muted-foreground" /></Link>
                            </div>
                            <h3 className="text-lg font-semibold">No accounts found</h3>
                            <p className="text-sm text-muted-foreground">
                                You don't have any trading accounts yet. Start a challenge to get funded.
                            </p>
                            <Link href="/challenge/buy">
                                <Button>Get Started</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account: any) => (
                            <Card key={account._id} className="overflow-hidden border-l-4 border-l-primary/50 hover:border-l-primary transition-all">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {account.challengeType}
                                    </CardTitle>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${account.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        account.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {account.status}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${account.balance.toLocaleString()}</div>
                                    <p className="text-xs text-muted-foreground">Balance</p>

                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="font-medium text-destructive">${account.metrics.dailyLoss?.toLocaleString() ?? 0}</p>
                                            <p className="text-xs text-muted-foreground">Daily Limit</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-destructive">${account.metrics.maxLoss?.toLocaleString() ?? 0}</p>
                                            <p className="text-xs text-muted-foreground">Max Loss</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Login:</span>
                                            <span className="font-mono text-foreground">{account.credentials.login}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Password:</span>
                                            <span className="font-mono text-foreground">{account.credentials.password}</span>
                                        </div>
                                    </div>

                                    {account.status === 'failed' ? (
                                        <div className="space-y-2 mt-4">
                                            <Button variant="destructive" className="w-full" disabled>
                                                Account Breached
                                            </Button>
                                            <Link href="/challenge/buy" className="block w-full">
                                                <Button className="w-full bg-primary/90 hover:bg-primary">
                                                    Start New Challenge
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <Link href={`/terminal/${account._id}`}>
                                            <Button variant="outline" className="mt-4 w-full">
                                                Open Web Terminal
                                            </Button>
                                        </Link>
                                    )}

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
