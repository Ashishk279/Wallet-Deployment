import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    address: { type: String, trim: true, default: "" },
    balance: { type: String,  trim: true, default: "" },
    transactions: [
        {
            txHash: { type: String },
            amount: { type: String },
            date: { type: Date, default: Date.now },
        },
    ],
});

const Wallet = mongoose.model('Wallet', walletSchema);

export { Wallet }