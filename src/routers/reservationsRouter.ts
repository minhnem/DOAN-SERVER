import { Router } from "express";
import { addNewReservations, getAllReservationsStatus, getReservationsById, removeReservations, updateReservations } from "../controller/reservations";

const router = Router()

router.put('/update-reservations', updateReservations)
router.get('/get-table-reservations', getReservationsById)
router.post('/add-new-reservations', addNewReservations)
router.delete('/delete-reservations', removeReservations)
router.get('/get-reservations-status', getAllReservationsStatus)

export default router