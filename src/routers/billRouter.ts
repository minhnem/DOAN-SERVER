import { Router } from "express";
import { addNewBill } from "../controller/bill";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.post('/add-new-bill', verifyToken, authorize([0,1]), addNewBill)

export default router