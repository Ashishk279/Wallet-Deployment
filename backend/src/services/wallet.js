import { Wallet } from "../models/wallet.js"
import { ApiError } from "../utils/apiErrors.js";
import { BAD_REQUEST } from "../utils/responseCode.js";

const createWallet = async(inputs) => {
    let wallet;

    wallet = await Wallet.findOne({address: inputs.address});
    if(!wallet){
        wallet = await Wallet.create({address: inputs.address, balance: inputs.balance})
        return wallet;
    }

    return wallet;
}

const createTransfer = async(inputs) => {
    const sender = await Wallet.findOne({ address: inputs.fromAddress });
    const receiver = await Wallet.findOne({ address: inputs.toAddress });

    if (!sender || !receiver) throw new ApiError(BAD_REQUEST, "Wallet not found.")

    sender.transactions.push({ txHash: inputs.txHash, amount: `-${inputs.amount}` });
    receiver.transactions.push({ txHash: inputs.txHash, amount: inputs.amount });
    
    await sender.save();
    await receiver.save();

    return sender;
}

const getAccount = async(param) => {
    let account;
    account = await Wallet.findOne({address: param.address})
    if(!account) throw new ApiError(BAD_REQUEST, "Wallet not found.");

    return account;
}

export { createWallet, createTransfer, getAccount}