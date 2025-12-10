import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth"; // Verify this path

// Define coupons (In a real app, fetch from DB)
const COUPONS: Record<string, number> = {
    'SAVE10': 0.10, // 10% off
    'WELCOME20': 0.20, // 20% off
    'PRO50': 0.50, // 50% off
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, currency = 'INR', couponCode } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        let finalAmount = amount;
        let discount = 0;

        // Apply Coupon
        if (couponCode && COUPONS[couponCode]) {
            discount = amount * COUPONS[couponCode];
            finalAmount = amount - discount;
        }

        // Exchange Rate (Fixed for now, or fetch from an API)
        const EXCHANGE_RATE = 86.5; // 1 USD = 86.5 INR

        let finalAmountInINR = finalAmount;
        if (currency === 'USD') {
            finalAmountInINR = finalAmount * EXCHANGE_RATE;
        }

        const options = {
            amount: Math.round(finalAmountInINR * 100), // Razorpay accepts amount in paise
            currency: 'INR', // Razorpay primary currency
            receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            notes: {
                userId: (session.user as any).id || (session.user as any).email,
                originalAmount: amount,
                originalCurrency: currency,
                couponCode: couponCode || 'NONE',
                discount,
                exchangeRate: EXCHANGE_RATE,
            },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            originalAmount: amount,
            discountedAmount: finalAmount,
            discountApplied: discount > 0,
        });

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
