import mongoose, {Schema} from "mongoose";

const TransactionSchema = new Schema({
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    type: {type: String, enum: ['expense', 'income'], required: true},
    date: {type: Date, required: true},
    category: {type: String, required: true},
});


export const Transaction = mongoose.model.transaction || mongoose.model("transaction", TransactionSchema)

// export default Transaction