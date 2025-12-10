import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
    accountId: mongoose.Types.ObjectId;
    symbol: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice?: number;
    amount: number; // Lot size or Dollar amount
    pnl?: number;
    status: 'OPEN' | 'CLOSED';
    closedAt?: Date;
}

const TradeSchema = new Schema<ITrade>({
    accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    entryPrice: { type: Number, required: true },
    exitPrice: { type: Number },
    amount: { type: Number, required: true },
    pnl: { type: Number },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    closedAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Trade || mongoose.model<ITrade>("Trade", TradeSchema);
