import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Account from '@/models/Account';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const account = await Account.findById(id);
        if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Lazy Daily Reset Logic
        const now = new Date();
        const lastReset = new Date(account.lastDailyReset || account.createdAt);
        const oneDay = 24 * 60 * 60 * 1000;

        if (now.getTime() - lastReset.getTime() > oneDay) {
            // Reset Daily Stats
            account.lastDayBalance = account.balance;
            account.metrics.currentDailyLoss = 0;
            account.lastDailyReset = now;
            await account.save();
        }

        // Fetch Open Trades
        const Trade = (await import('@/models/Trade')).default;
        const trades = await Trade.find({ accountId: id, status: 'OPEN' }).sort({ createdAt: -1 });

        return NextResponse.json({ account, trades });
    } catch (e) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
