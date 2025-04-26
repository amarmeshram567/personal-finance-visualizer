import mongoose, {Schema} from "mongoose";

import { z } from "zod";


export const TransactionSchemaZod = z.object({
    amount: z.number().positive(),
    description: z.string().min(1),
    type: z.enum(['expense', 'income'], {message: 'Type must be "expense" or "income" '}),
    date: z.date({message: 'Date is required'}),
    category: z.string().min(1),
});

export type TransactionType = z.infer<typeof TransactionSchemaZod>;

const TransactionSchema = new Schema({
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    type: {type: String, enum: ['expense', 'income'], required: true},
    date: {type: Date, required: true},
    category: {type: String, required: true},
}, {timestamps: true});

// export const Transaction = mongoose.Transaction || mongoose.model<TransactionType>('Transaction', TransactionSchema);

// export const Transaction = models.Transaction || model<TransactionType>('Transaction', TransactionSchema);

const transactionModel = mongoose.model.transaction || mongoose.model("transaction", TransactionSchema);
export default transactionModel


//mongoose.