import { Router } from "express";
import { addNewTable, getAllTable, removeTable, updateTable } from "../controller/table";

const router = Router()

router.get('/', getAllTable)
router.post('/add-new-table', addNewTable)
router.put('/update-table', updateTable)
router.delete('/delete-table', removeTable)

export default router