import { Router } from "express";
import { getTimeBill, predictRevenueNextWeek, predictTop5Dishes } from "../controller/report";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/get-data-time', verifyToken, authorize([0]), getTimeBill)
router.get('/predictions', verifyToken, authorize([0]), predictRevenueNextWeek)
router.get('/predict-top-sale', verifyToken, authorize([0]), predictTop5Dishes)

export default router