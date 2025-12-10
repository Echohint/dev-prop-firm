import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Account from '@/models/Account';
import Trade from '@/models/Trade';
import JournalEntry from '@/models/JournalEntry'; // To update pnl for the day

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const { amount, symbol, type, sl, tp } = await req.json(); // type: 'BUY' | 'SELL'

        const account = await Account.findById(id);
        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.status === 'failed') {
            return NextResponse.json({ error: 'Account is breached. Trading disabled.' }, { status: 400 });
        }

        // Simulate Trade Result (60% Win Rate for User Gratification)
        const isWin = Math.random() > 0.4;
        const pnl = isWin ? amount * 2 : -amount;

        const newBalance = account.balance + pnl;
        const newEquity = account.equity + pnl;

        // RULE ENGINE
        const currentDailyLoss = account.lastDayBalance - newEquity;
        const currentMaxLoss = account.startingBalance - newEquity;

        let newStatus = 'active';
        let failReason = null;

        // Check Max Loss
        if (currentMaxLoss >= account.metrics.maxLoss) {
            newStatus = 'failed';
            failReason = 'Max Loss Limit Breached';
        }

        // Check Daily Loss
        if (currentDailyLoss >= account.metrics.dailyLoss) {
            newStatus = 'failed';
            failReason = 'Daily Loss Limit Breached';
        }

        // Check Profit Target (Payout Eligibility)
        const profitTarget = account.metrics.profitTarget || (account.startingBalance * 0.10);
        if (newEquity >= account.startingBalance + profitTarget && newStatus === 'active') {
            account.payoutEligible = true;
        }

        // Update Account
        account.balance = newBalance;
        account.equity = newEquity;
        account.metrics.currentDailyLoss = currentDailyLoss > 0 ? currentDailyLoss : 0;
        account.metrics.currentMaxLoss = currentMaxLoss > 0 ? currentMaxLoss : 0;
        account.status = newStatus;
        await account.save();

        // Create Trade Log
        const trade = await Trade.create({
            accountId: account._id,
            symbol: symbol || 'BTCUSD',
            type: type || 'BUY',
            entryPrice: Math.random() * 1000 + 1000, // Mock Price
            exitPrice: Math.random() * 1000 + 1000, // Mock Price
            amount: amount,
            sl: sl,
            tp: tp,
            pnl: pnl,
            status: 'CLOSED',
            closedAt: new Date()
        });

        // Update Journal (Daily P&L)
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
            message: newStatus === 'failed' ? `Account Failed: ${failReason}` : 'Trade Executed'
        });

    } catch (error) {
        console.error("Trade Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
