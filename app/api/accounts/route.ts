import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Account from "@/models/Account";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const accounts = await Account.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });

    return NextResponse.json({ accounts });
}
