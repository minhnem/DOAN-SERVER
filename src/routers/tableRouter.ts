import { Router } from "express";
import { addNewTable, getAllTable, getTableReservations, removeTable, updateStatusTable, updateTable } from "../controller/table";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/', verifyToken, authorize([0,1]), getAllTable)
router.get('/get-table-reservations', verifyToken, authorize([0,1]), getTableReservations)
router.post('/add-new-table', verifyToken, authorize([0,1]), addNewTable)
router.put('/update-table', verifyToken, authorize([0,1]), updateTable)
router.delete('/delete-table', verifyToken, authorize([0,1]), removeTable)
router.put('/update-status-table', verifyToken, authorize([0,1]), updateStatusTable)

export default router