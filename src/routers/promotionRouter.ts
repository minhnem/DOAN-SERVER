import { Router } from "express";
import { addNew, checkPromotion, getPromotion, removePromotion, updatePromotion } from "../controller/promotions";

const router = Router()

router.get('/', getPromotion)

router.post('/add-promotion', addNew)
router.put('/update-promotion', updatePromotion)
router.delete('/delete-promotion', removePromotion)
router.get('/check-promotion', checkPromotion)

export default router