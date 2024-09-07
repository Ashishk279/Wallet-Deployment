import { createTransfer, createWallet, getAccount } from "../services/wallet.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { OK } from "../utils/responseCode.js";
import { validateWallet, validateTransfer } from "../validations/wallet.js";


const ConnectWallet = async (req, res, next) => {
    try {
        const { address, balance } = req.body;
        await validateWallet(req.body);
        const newWallet = await createWallet(req.body);
        return res.status(OK).json(new ApiResponse(OK, newWallet,"Wallet Connected Successfully"))
    } catch (err) {
        next(err)

    }
}

const TranferEthers = async (req, res, next) => {
    try {
        const { fromAddress, toAddress, amount, txHash } = req.body;
        await validateTransfer(req.body);
        const transfer = await createTransfer(req.body);
        return res.status(OK).json(new ApiResponse(OK, transfer,"Successfully Send Ethers"))
    } catch (err) {
        next(err)

    }
}
const GetAccount = async (req, res, next) => {
    try {
        const account = await getAccount(req.params);
        return res.status(OK).json(new ApiResponse(OK, account,"Successfully Send Ethers"))
    } catch (err) {
        next(err)

    }
}





export {
    ConnectWallet,
    TranferEthers,
    GetAccount
}