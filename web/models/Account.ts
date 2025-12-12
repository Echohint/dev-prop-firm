import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
    userId: string;
    credentials: {
        login: string;
        password?: string;
        server: string;
    };
    balance: number;
    equity: number;
    startingBalance: number; // For Max Loss
    lastDayBalance: number; // For Daily Loss
    status: 'active' | 'failed' | 'passed';
    planType: string;
    metrics: {
        dailyLoss: number;
        maxLoss: number;
        profitTarget: number;
        currentDailyLoss: number;
        currentMaxLoss: number;
    };
    payoutEligible: boolean;
    payoutRequested: boolean;
    lastDailyReset: Date;
}

const AccountSchema = new Schema<IAccount>({
    userId: { type: String, required: true },
    credentials: {
        login: { type: String, required: true },
        password: { type: String },
        server: { type: String, default: 'Demo' }
    },
    balance: { type: Number, required: true },
    equity: { type: Number, required: true },
    startingBalance: { type: Number, required: true },
    lastDayBalance: { type: Number, required: true },
    status: { type: String, enum: ['active', 'failed', 'passed'], default: 'active' },
    planType: { type: String, required: true },
    metrics: {
        dailyLoss: { type: Number, required: true },
        maxLoss: { type: Number, required: true },
        profitTarget: { type: Number, required: true },
        currentDailyLoss: { type: Number, default: 0 },
        currentMaxLoss: { type: Number, default: 0 }
    },
    payoutEligible: { type: Boolean, default: false },
    payoutRequested: { type: Boolean, default: false },
    lastDailyReset: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);
