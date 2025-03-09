import { Router } from "express";
import { register } from "../controller/user";

const router = Router()

router.post('/register', register)

export default router 