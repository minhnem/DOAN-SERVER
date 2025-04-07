import { Router } from "express";
import { addNewBill } from "../controller/bill";

const router = Router()

router.post('/add-new-bill', addNewBill)

export default router