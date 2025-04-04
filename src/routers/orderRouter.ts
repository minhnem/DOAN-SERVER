import { Router } from "express";
import { addNewOrder, getOrder, removeMenuItemInOrder,  } from "../controller/order";

const router = Router()

router.post('/add-new-order', addNewOrder)
router.delete('/delete-dish-order', removeMenuItemInOrder)
router.get('/', getOrder)

export default router