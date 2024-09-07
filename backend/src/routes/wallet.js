import express from "express";
const walletRoutes = express.Router();
import { ConnectWallet, TranferEthers ,GetAccount } from "../controllers/wallet.js";

walletRoutes.post('/connect', ConnectWallet)
walletRoutes.post('/transfer', TranferEthers)
walletRoutes.get('/get-wallet/:address', GetAccount)

export { walletRoutes}

