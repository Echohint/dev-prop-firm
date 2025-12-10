import mongoose, { Schema, Document } from "mongoose";

export interface IJournalEntry extends Document {
    userId: string;
    date: string; // ISO Date YYYY-MM-DD
    notes: string;
    mood?: 'happy' | 'neutral' | 'frustrated' | 'tilted';
    tags?: string[];
    totalPnl: number;
}

const JournalEntrySchema = new Schema<IJournalEntry>({
    userId: { type: String, required: true },
    date: { type: String, required: true }, // Index for calendar query
    notes: { type: String, required: true },
    mood: { type: String, enum: ['happy', 'neutral', 'frustrated', 'tilted'] },
    tags: [{ type: String }],
    totalPnl: { type: Number, default: 0 }
}, { timestamps: true });

// Compound index to ensure one journal entry per day per user
JournalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);
