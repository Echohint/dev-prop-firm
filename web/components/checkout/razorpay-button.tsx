'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RazorpayButtonProps {
    amount: number; // Amount in USD
    currency?: string;
    plan: string;
}

export default function RazorpayButton({ amount, currency = 'USD', plan }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [discountApplied, setDiscountApplied] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // 1. Create Order
            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, couponCode: coupon, plan }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (data.discountApplied) {
                setDiscountApplied(true);
                toast.success(`Coupon Applied! You saved ₹${data.originalAmount * data.exchangeRate - data.discountedAmount * data.exchangeRate}`);
            }

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key here if needed
                amount: data.amount,
                currency: data.currency,
                name: 'Dev Prop Firm',
                description: `Challenge: ${plan}`,
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        toast.success('Payment Successful! Redirecting to setup...');
                        // Redirect to the new account terminal
                        window.location.href = `/terminal/${verifyData.accountId}`;
                    } else {
                        toast.error(verifyData.message || 'Verification Failed');
                    }
                },
                prefill: {
                    name: 'Dev Soniyata', // Pre-fill from session if available
                    email: 'dev@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="flex gap-2">
                <Input
                    placeholder="Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={loading || discountApplied}
                />
            </div>

            <Button onClick={handlePayment} disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Pay Now'}
            </Button>
        </div>
    );
}
