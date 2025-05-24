import { Router } from "express";
import { addNewPersonnel, getAllPersonnel, removePersonnel, updatePersonnel } from "../controller/personnel";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/get-all-personnel', verifyToken, authorize([0]), getAllPersonnel)
router.post('/add-new', verifyToken, authorize([0]), addNewPersonnel)
router.put('/update-personnel', verifyToken, authorize([0]), updatePersonnel)
router.delete('/delete-personnel', verifyToken, authorize([0]), removePersonnel)

export default router