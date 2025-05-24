import { Router } from "express";
import { addNew, checkPromotion, getPromotion, handleNotification, removePromotion, updatePromotion } from "../controller/promotions";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.get('/', getPromotion)

router.post('/add-promotion', verifyToken, authorize([0]), addNew)
router.put('/update-promotion', verifyToken, authorize([0]), updatePromotion)
router.delete('/delete-promotion', verifyToken, authorize([0]), removePromotion)
router.get('/check-promotion', verifyToken, authorize([0]), checkPromotion)
router.get('/notifycation', verifyToken, authorize([0]), handleNotification)

export default router