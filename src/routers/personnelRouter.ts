import { Router } from "express";
import { addNewPersonnel, getAllPersonnel, removePersonnel, updatePersonnel } from "../controller/personnel";

const router = Router()

router.get('/get-all-personnel', getAllPersonnel)
router.post('/add-new', addNewPersonnel)
router.put('/update-personnel', updatePersonnel)
router.delete('/delete-personnel', removePersonnel)

export default router