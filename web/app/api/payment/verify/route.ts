import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { razorpay } from '@/lib/razorpay';
import connectDB from '@/lib/db';
import Account from '@/models/Account';

const PLAN_BALANCES: Record<string, number> = {
    '2K Challenge': 2000,
    '5K Challenge': 5000,
    '10K Challenge': 10000,
    '25K Challenge': 25000,
    '50K Challenge': 50000,
    '100K Challenge': 100000,
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verified!
            await connectDB();

            // Fetch order to get the Plan details from notes
            const order = await razorpay.orders.fetch(razorpay_order_id);
            const plan = String(order.notes?.plan || 'Unknown');

            // Determine Account Size
            let balance = 10000; // Default
            if (PLAN_BALANCES[plan]) {
                balance = PLAN_BALANCES[plan];
            } else {
                // Fallback: try to parseInt from plan string (e.g. "100K Challenge")
                const match = plan.match(/(\d+)K/);
                if (match) {
                    balance = parseInt(match[1]) * 1000;
                }
            }

            const dailyLossLimit = balance * 0.05; // 5%
            const maxLossLimit = balance * 0.10;   // 10%
            const profitTarget = balance * 0.10;   // 10% Target

            // Create Account
            const newAccount = await Account.create({
                userId: (session.user as any).id,
                credentials: {
                    login: Math.floor(10000000 + Math.random() * 90000000).toString(), // 8 digit login
                    password: Math.random().toString(36).slice(-8), // 8 char random password
                    server: 'DevProp-Demo'
                },
                balance: balance,
                equity: balance,
                startingBalance: balance,
                lastDayBalance: balance,
                status: 'active',
                planType: plan,
                metrics: {
                    dailyLoss: dailyLossLimit,
                    maxLoss: maxLossLimit,
                    profitTarget: profitTarget,
                    currentDailyLoss: 0,
                    currentMaxLoss: 0
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Payment verified and account created',
                accountId: newAccount._id
            });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
        }

    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
