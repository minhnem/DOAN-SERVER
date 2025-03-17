import { Router } from "express";
import { addNew, deleteSupplier, getDatas, getForm, getSupplierDetail, getSuppliers, updateSupplier } from "../controller/supplier";

const router = Router()

router.get('/', getSuppliers)
router.get('/get-form', getForm)
router.get('/get-supplier-detail', getSupplierDetail)
router.post('/get-export-data', getDatas)
router.post('/add-new', addNew)
router.put('/update', updateSupplier)
router.delete('/delete', deleteSupplier)

export default router