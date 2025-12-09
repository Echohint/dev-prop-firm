import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
    userId: mongoose.Types.ObjectId;
    challengeType: string; // e.g., "10K Challenge"
    status: "active" | "failed" | "passed" | "disabled" | "pending";
    balance: number;
    equity: number;
    credentials: {
        login: string;
        server: string;
        password?: string;
    };
    metrics: {
        dailyLoss: number;
        maxLoss: number;
        profitTarget: number;
        currentDailyLoss: number;
        currentMaxLoss: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const AccountSchema: Schema<IAccount> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        challengeType: { type: String, required: true },
        status: {
            type: String,
            enum: ["active", "failed", "passed", "disabled", "pending"],
            default: "pending"
        },
        balance: { type: Number, required: true },
        equity: { type: Number, required: true },
        credentials: {
            login: { type: String, default: "" },
            server: { type: String, default: "FundedFirm-Demo" },
            password: { type: String, default: "" }
        },
        metrics: {
            dailyLoss: { type: Number, default: 0 },
            maxLoss: { type: Number, default: 0 },
            profitTarget: { type: Number, default: 0 },
            currentDailyLoss: { type: Number, default: 0 },
            currentMaxLoss: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
