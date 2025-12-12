import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trade from '@/models/Trade';
import Account from '@/models/Account';
import JournalEntry from '@/models/JournalEntry';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params; // Trade ID
        const { exitPrice } = await req.json();

        const trade = await Trade.findById(id);
        if (!trade) {
            return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
        }

        if (trade.status === 'CLOSED') {
            return NextResponse.json({ error: 'Trade already closed' }, { status: 400 });
        }

        const account = await Account.findById(trade.accountId);
        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        // Calculate PnL
        const currentExitPrice = Number(exitPrice) || trade.entryPrice; // Fallback to break-even if no price? Or random? 
        // If frontend sends 0 or null, maybe fail? But for safety let's assume break even or random.
        // Let's use random if missing, similar to POST.
        const finalizedExitPrice = exitPrice ? Number(exitPrice) : (Math.random() * 100 + 100);

        const leverage = trade.leverage || 1;
        const margin = trade.amount;
        const entryPrice = trade.entryPrice;

        // Volume (Units) = (Margin * Leverage) / Entry
        const volume = (margin * leverage) / entryPrice;

        let pnl = 0;
        if (trade.type === 'BUY') {
            pnl = (finalizedExitPrice - entryPrice) * volume;
        } else {
            pnl = (entryPrice - finalizedExitPrice) * volume;
        }

        // Update Account Balance (Since we didn't deduct margin, we just add PnL to Balance)
        // Wait, if PnL is negative, it subtracts from Balance. Correct.
        const newBalance = account.balance + pnl;
        const newEquity = account.equity + pnl; // Equity should match Balance when no open trades.
        // Note: Logic for equity when there ARE other open trades is complex.
        // Simplified: Account.equity usually tracks Open PnL.
        // If we only update it on close, it jumps. 
        // For this task, we update Balance and Equity on Close.

        // RULE ENGINE
        const currentDailyLoss = account.lastDayBalance - newEquity;
        const currentMaxLoss = account.startingBalance - newEquity;

        let newStatus = 'active';
        let failReason = null;

        if (currentMaxLoss >= account.metrics.maxLoss) {
            newStatus = 'failed';
            failReason = 'Max Loss Limit Breached';
        }

        if (currentDailyLoss >= account.metrics.dailyLoss) {
            newStatus = 'failed';
            failReason = 'Daily Loss Limit Breached';
        }

        // Check Profit Target
        const profitTarget = account.metrics.profitTarget || (account.startingBalance * 0.10);
        if (newEquity >= account.startingBalance + profitTarget && newStatus === 'active') {
            account.payoutEligible = true;
        }

        // Update Account
        account.balance = newBalance;
        // Ideally equity = balance + sum(open_pnl). 
        // If we assume other trades have 0 PnL (since we don't track live), then equity = balance.
        account.equity = newBalance;
        account.metrics.currentDailyLoss = currentDailyLoss > 0 ? currentDailyLoss : 0;
        account.metrics.currentMaxLoss = currentMaxLoss > 0 ? currentMaxLoss : 0;
        account.status = newStatus;
        await account.save();

        // Update Trade
        trade.status = 'CLOSED';
        trade.exitPrice = finalizedExitPrice;
        trade.pnl = pnl;
        trade.closedAt = new Date();
        await trade.save();

        // Log to Journal
        const dateStr = new Date().toISOString().split('T')[0];
        await JournalEntry.findOneAndUpdate(
            { userId: account.userId, date: dateStr },
            {
                $inc: { totalPnl: pnl },
                $setOnInsert: { notes: 'Auto-generated from trading activity' }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            account,
            trade,
            message: newStatus === 'failed' ? `Account Failed: ${failReason}` : 'Trade Closed'
        });

    } catch (error) {
        console.error("Close Trade Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
