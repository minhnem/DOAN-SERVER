import { Router } from "express";
import { addNew, deleteSupplier, getDatas, getForm, getSupplierDetail, getSuppliers, updateSupplier } from "../controller/supplier";
import { authorize } from "../middlewares/authorize";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router()

router.get('/', verifyToken, authorize([0]), getSuppliers)
router.get('/get-form', verifyToken, authorize([0]), getForm)
router.get('/get-supplier-detail', verifyToken, authorize([0]), getSupplierDetail)
router.post('/get-export-data', verifyToken, authorize([0]), getDatas)
router.post('/add-new', verifyToken, authorize([0]), addNew)
router.put('/update', verifyToken, authorize([0]), updateSupplier)
router.delete('/delete', verifyToken, authorize([0]), deleteSupplier)

export default router