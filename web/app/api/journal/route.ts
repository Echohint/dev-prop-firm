import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const userId = (session.user as any).id;

    if (date) {
        // Fetch single entry
        const entry = await JournalEntry.findOne({ userId, date });
        return NextResponse.json({ entry });
    } else {
        // Fetch all entries (month view)
        const entries = await JournalEntry.find({ userId }).sort({ date: -1 });
        return NextResponse.json({ entries });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { date, notes, mood } = await req.json();
    const userId = (session.user as any).id;

    const entry = await JournalEntry.findOneAndUpdate(
        { userId, date },
        { notes, mood },
        { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, entry });
}
