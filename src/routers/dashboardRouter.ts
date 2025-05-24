import { Router } from "express";
import { getAllData, getDataChart } from "../controller/dashboard";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/',  verifyToken, authorize([0]), getAllData)
router.get('/get-data-chart', verifyToken, authorize([0]), getDataChart)

export default router