import { Router } from "express";
import { addNewOrder, getOrder, removeMenuItemInOrder,  } from "../controller/order";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.post('/add-new-order', verifyToken, authorize([0,1]), addNewOrder)
router.delete('/delete-dish-order', verifyToken, authorize([0,1]), removeMenuItemInOrder)
router.get('/', verifyToken, authorize([0,1]), getOrder)

export default router