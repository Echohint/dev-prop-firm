import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Account from "@/models/Account";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { outcome, amount } = await req.json(); // outcome: 'win' | 'loss', amount: absolute value

    await connectDB();
    const account = await Account.findById(id);

    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    if (account.userId.toString() !== (session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (account.status !== "active") {
        return NextResponse.json({ error: "Account is not active" }, { status: 400 });
    }

    // Calculate generic PnL
    const pnl = outcome === 'win' ? amount : -amount;

    // Update Balance/Equity
    account.balance += pnl;
    account.equity += pnl;

    // Update Metrics
    const startOfDayBalance = account.equity - pnl; // Simplified: assuming equity was start balance for now (not accurate for real days but fine for demo)
    // Actually, for a proper daily loss, we need to track "StartOfDayEquity". 
    // For this demo, we will accumulate "dailyLoss" metric.

    if (pnl < 0) {
        account.metrics.currentDailyLoss += Math.abs(pnl);
        account.metrics.currentMaxLoss += Math.abs(pnl); // Max loss tracks drawdown
    } else {
        // Profit reduces current drawdown? Usually max loss is relative to High Water Mark or initial.
        // Standard Trailing Drawdown or Static?
        // Let's assume Static Max Loss relative to Initial Balance.
        // And Daily Loss resets daily (we won't implement cron reset here, just check threshold).
    }

    // Check Rules
    // 1. Daily Loss
    if (account.metrics.currentDailyLoss >= account.metrics.dailyLoss) {
        account.status = "failed";
    }

    // 2. Max Loss (Equity < InitialBalance - MaxLossLimit)
    // Or Track Total Loss.
    const initialBalance = 10000; // Hardcoded fallback or must be stored in account (we didn't store initialBalance, implicit in challenge type or metrics).
    // Actually, maxLoss metric in DB is the Limit value (e.g. 1000).
    // We should check if (InitialBalance - Equity) > MaxLossLimit.
    // We can approximate InitialBalance = Equity - TotalPnL?
    // Let's rely on stored "maxLoss" limit.
    // We need to know the initial balance. I'll infer it from challenge type or assume resets.
    // Let's just track "currentMaxLoss" as cumulative losses without profit offset for a "Hard" rule, or standard drawdown.
    // Standard: Equity < (InitialBalance - MaxLoss).
    // Let's assume InitialBalance was the `balance` when created. 
    // I didn't store `initialBalance` explicitly, but I can assume `balance` at creation was round number.
    // Let's use `currentMaxLoss` accumulator for now.

    if (account.metrics.currentMaxLoss >= account.metrics.maxLoss) {
        account.status = "failed";
    }

    await account.save();

    return NextResponse.json({ account });
}
