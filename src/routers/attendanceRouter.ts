import { Router } from "express";
import { addNewAttendance, getTimePersonnelAttendance } from "../controller/attendance";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/get-time-personnel-attendance', verifyToken, authorize([0,1]), getTimePersonnelAttendance)
router.post('/add-attendance', verifyToken, authorize([0]), addNewAttendance)

export default router