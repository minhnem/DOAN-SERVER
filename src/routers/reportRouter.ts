import { Router } from "express";
import { getTimeBill, predictRevenueNextWeek, predictTop5Dishes } from "../controller/report";

const router = Router()

router.get('/get-data-time', getTimeBill)
router.get('/predictions', predictRevenueNextWeek)
router.get('/predict-top-sale', predictTop5Dishes)

export default router