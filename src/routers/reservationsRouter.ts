import { Router } from "express";
import { addNewReservations, getReservationsById, removeReservations, updateReservations } from "../controller/reservations";

const router = Router()

router.put('/update-reservations', updateReservations)
router.get('/get-table-reservations', getReservationsById)
router.post('/add-new-reservations', addNewReservations)
router.delete('/delete-reservations', removeReservations)

export default router