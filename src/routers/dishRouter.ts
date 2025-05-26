import { Router } from "express";
import { addCategory, addProduct, deleteCategories, deleteProduct, filterProduct, getAllCategories, getAllCategoriesPerent, getAllProduct, getCategories, getCategoryDetail, getDishByIdCategories, getProductDetail, getProducts, updateCategory, updateProduct } from "../controller/dishes";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()


//dish
router.get('/', getProducts)
router.get('/get-all-dish', getAllProduct)
router.post('/add-new-dish', verifyToken, authorize([0]), addProduct)
router.delete('/delete-dish', verifyToken, authorize([0]), deleteProduct)
router.put('/update-dish', verifyToken, authorize([0]), updateProduct)
router.get('/get-dish-detail', getProductDetail)
router.post('/filter-dish', filterProduct)

//category
router.post('/add-new-category', verifyToken, authorize([0]), addCategory)
router.delete('/delete-category', verifyToken, authorize([0]), deleteCategories)
router.put('/update-category', verifyToken, authorize([0]), updateCategory)

router.get('/get-all-categories', getAllCategories)
router.get('/get-categories', getCategories)
router.get('/category/detail', getCategoryDetail)
router.get('/get-parent-category', getAllCategoriesPerent)
router.get('/get-dish-by-id-category', getDishByIdCategories)

export default router