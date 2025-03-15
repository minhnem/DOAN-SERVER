import { Router } from "express";
import { addCategory, deleteCategories, getAllCategories, getCategories, getCategoryDetail, updateCategory } from "../controller/dishes";

const router = Router()

router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)
router.put('/update-category', updateCategory)

router.get('/get-all-categories', getAllCategories)
router.get('/get-categories', getCategories)
router.get('/category/detail', getCategoryDetail)

export default router