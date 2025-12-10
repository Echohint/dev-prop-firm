import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Account from "@/models/Account";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, amount } = await req.json();

    // Validate request
    if (!type || !amount) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Create new account
    const newAccount = await Account.create({
        userId: (session.user as any).id,
        challengeType: type,
        status: "active", // Immediate activation for demo
        balance: amount,
        equity: amount,
        credentials: {
            login: Math.floor(100000 + Math.random() * 900000).toString(),
            password: Math.random().toString(36).slice(-8),
            server: "FundedFirm-Demo"
        },
        metrics: {
            dailyLoss: amount * 0.05, // 5% daily loss
            maxLoss: amount * 0.10, // 10% max loss
            profitTarget: amount * 0.10, // 10% target
        }
    });

    return NextResponse.json({ account: newAccount });
}
