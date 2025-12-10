import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Account from "@/models/Account";

export async function GET() {
    await connectDB();

    // Find top 10 accounts sorted by balance (high balance = profit).
    // In a real app we would calculate profit %
    const accounts = await Account.find({ status: { $in: ["active", "passed"] } })
        .populate("userId", "name image")
        .sort({ balance: -1 })
        .limit(10);

    const leaderboard = accounts.map((acc: any, index: number) => ({
        rank: index + 1,
        user: acc.userId.name,
        badge: index < 3 ? (index === 0 ? "Gold" : index === 1 ? "Silver" : "Bronze") : null,
        accountSize: `$${acc.equity.toLocaleString()}`, // Using equity as base size for simplicity
        profit: `$${(acc.balance - acc.equity).toLocaleString()}`, // Simple profit calc
        profitPercent: `${(((acc.balance - acc.equity) / acc.equity) * 100).toFixed(2)}%`,
    }));

    return NextResponse.json({ leaderboard });
}
