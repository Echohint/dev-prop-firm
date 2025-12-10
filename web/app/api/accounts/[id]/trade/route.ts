import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Account from '@/models/Account';
import Trade from '@/models/Trade';
import JournalEntry from '@/models/JournalEntry'; // To update pnl for the day

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;
        const { outcome, amount, symbol } = await req.json(); // outcome: 'win' | 'loss', amount: risk amount

        const account = await Account.findById(id);
        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.status === 'failed') {
            return NextResponse.json({ error: 'Account is breached. Trading disabled.' }, { status: 400 });
        }

        // Simulate Trade Result
        const pnl = outcome === 'win' ? amount * 2 : -amount; // 1:2 Risk Reward simulated
        const newBalance = account.balance + pnl;
        const newEquity = account.equity + pnl; // Assuming closed trade for now

        // RULE ENGINE
        const currentDailyLoss = account.lastDayBalance - newEquity;
        const currentMaxLoss = account.startingBalance - newEquity;

        let newStatus = 'active';
        let failReason = null;

        // Check Max Loss (e.g., 10%)
        if (currentMaxLoss >= account.metrics.maxLoss) {
            newStatus = 'failed';
            failReason = 'Max Loss Limit Breached';
        }

        // Check Daily Loss (e.g., 5%)
        // Note: Logic allows profit to buffer daily loss, standard prop firm rule
        if (currentDailyLoss >= account.metrics.dailyLoss) {
            newStatus = 'failed';
            failReason = 'Daily Loss Limit Breached';
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
            type: outcome === 'win' ? 'BUY' : 'SELL', // Mocking direction
            entryPrice: 0, // Mock
            exitPrice: 0, // Mock
            amount: amount,
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
