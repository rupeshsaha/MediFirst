import {Router} from "express"
import { createTransaction, getAllTransactions, rechargeWallet } from "../controllers/transaction.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/create",protectRoute, createTransaction);
router.post("/recharge",protectRoute, rechargeWallet);
router.get("/", protectRoute, getAllTransactions);

export default router