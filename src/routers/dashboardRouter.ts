import { Router } from "express";
import { getAllData, getDataChart } from "../controller/dashboard";

const router = Router()

router.get('/', getAllData)
router.get('/get-data-chart', getDataChart)

export default router