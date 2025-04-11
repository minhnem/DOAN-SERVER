import { Router } from "express";
import { addCategory, addProduct, deleteCategories, deleteProduct, filterProduct, getAllCategories, getAllCategoriesPerent, getAllProduct, getCategories, getCategoryDetail, getDishByIdCategories, getProductDetail, getProducts, updateCategory, updateProduct } from "../controller/dishes";

const router = Router()


//dish
router.get('/', getProducts)
router.get('/get-all-dish', getAllProduct)
router.post('/add-new-dish', addProduct)
router.delete('/delete-dish', deleteProduct)
router.put('/update-dish', updateProduct)
router.get('/get-dish-detail', getProductDetail)
router.post('/filter-dish', filterProduct)

//category
router.post('/add-new-category', addCategory)
router.delete('/delete-category', deleteCategories)
router.put('/update-category', updateCategory)

router.get('/get-all-categories', getAllCategories)
router.get('/get-categories', getCategories)
router.get('/category/detail', getCategoryDetail)
router.get('/get-parent-category', getAllCategoriesPerent)
router.get('/get-dish-by-id-category', getDishByIdCategories)

export default router