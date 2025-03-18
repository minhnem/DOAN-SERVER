import { Router } from "express";
import { addNew, getPromotion, removePromotion, updatePromotion } from "../controller/promotions";

const router = Router()

router.get('/', getPromotion)

router.post('/add-promotion', addNew)
router.put('/update-promotion', updatePromotion)
router.delete('/delete-promotion', removePromotion)

export default router