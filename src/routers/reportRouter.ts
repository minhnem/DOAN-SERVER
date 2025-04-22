import { Router } from "express";
import { getTimeBill } from "../controller/report";

const router = Router()

router.get('/get-data-time', getTimeBill)

export default router