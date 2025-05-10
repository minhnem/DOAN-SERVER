import { Router } from "express";
import { addNewSubscribe } from "../controller/subscribe";

const router = Router()

router.post('/add-new', addNewSubscribe)

export default router