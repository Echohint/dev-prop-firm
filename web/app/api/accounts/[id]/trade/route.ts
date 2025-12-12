import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Account from '@/models/Account';
import Trade from '@/models/Trade';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const { amount, symbol, type, sl, tp, leverage, price } = await req.json(); // type: 'BUY' | 'SELL'

        const account = await Account.findById(id);
        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        if (account.status === 'failed') {
            return NextResponse.json({ error: 'Account is breached. Trading disabled.' }, { status: 400 });
        }

        // Check Margin/Balance
        // Assuming 'amount' is the Margin the user is willing to lock
        if (amount > account.equity) {
            return NextResponse.json({ error: 'Insufficient Balance' }, { status: 400 });
        }

        // Create OPEN Trade
        // We rely on frontend to send current price. if not, we default to random (for testing)
        const entryPrice = price || (Math.random() * 100 + 100);

        const trade = await Trade.create({
            accountId: account._id,
            symbol: symbol || 'NASDAQ:AAPL',
            type: type || 'BUY',
            entryPrice: Number(entryPrice),
            amount: Number(amount), // This is Margin
            leverage: Number(leverage) || 1,
            sl: sl ? Number(sl) : undefined,
            tp: tp ? Number(tp) : undefined,
            status: 'OPEN',
            pnl: 0
        });

        // We do typically lock margin, but for this simplified sim, we just ensure they had it.
        // We do NOT update account balance/equity until close.

        return NextResponse.json({
            success: true,
            account, // Return account as is (or updated if we locked margin)
            trade,
            message: 'Order Placed'
        });

    } catch (error) {
        console.error("Trade Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
