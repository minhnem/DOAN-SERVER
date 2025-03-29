import { Router } from "express";
import { addNewTable, getAllTable, getTableReservations, removeTable, updateTable } from "../controller/table";

const router = Router()

router.get('/', getAllTable)
router.get('/get-table-reservations', getTableReservations)
router.post('/add-new-table', addNewTable)
router.put('/update-table', updateTable)
router.delete('/delete-table', removeTable)

export default router