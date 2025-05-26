import { Router } from "express";
import { addNewReservations, getAllReservationsStatus, getReservationsById, removeReservations, updateReservations } from "../controller/reservations";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.put('/update-reservations', verifyToken, authorize([0,1]), updateReservations)
router.get('/get-table-reservations', verifyToken, authorize([0,1]), getReservationsById)
router.post('/add-new-reservations', addNewReservations)
router.delete('/delete-reservations', verifyToken, authorize([0,1]), removeReservations)
router.get('/get-reservations-status', verifyToken, authorize([0,1]), getAllReservationsStatus)

export default router