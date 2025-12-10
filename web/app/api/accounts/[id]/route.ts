import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Account from '@/models/Account';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const account = await Account.findById(id);
        if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ account });
    } catch (e) {
        return NextResponse.json({ error: 'Error' }, { status: 500 });
    }
}
