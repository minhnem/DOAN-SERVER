import { Router } from "express";
import { addNewAttendance, getTimePersonnelAttendance } from "../controller/attendance";

const router = Router()

router.get('/get-time-personnel-attendance', getTimePersonnelAttendance)
router.post('/add-attendance', addNewAttendance)

export default router