import { Router } from "express";
import { addNewTable, getAllTable, getTableReservations, removeTable, updateStatusTable, updateTable } from "../controller/table";

const router = Router()

router.get('/', getAllTable)
router.get('/get-table-reservations', getTableReservations)
router.post('/add-new-table', addNewTable)
router.put('/update-table', updateTable)
router.delete('/delete-table', removeTable)
router.put('/update-status-table', updateStatusTable)

export default router