import { Router } from "express";
import { addCategory, addProduct, deleteCategories, deleteProduct, filterProduct, getAllCategories, getAllCategoriesPerent, getAllProduct, getCategories, getCategoryDetail, getDishByIdCategories, getProductDetail, getProducts, updateCategory, updateProduct } from "../controller/dishes";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()


//dish
router.get('/', verifyToken, authorize([0,1]), getProducts)
router.get('/get-all-dish', verifyToken, authorize([0,1]), getAllProduct)
router.post('/add-new-dish', verifyToken, authorize([0]), addProduct)
router.delete('/delete-dish', verifyToken, authorize([0]), deleteProduct)
router.put('/update-dish', verifyToken, authorize([0]), updateProduct)
router.get('/get-dish-detail', verifyToken, authorize([0,1]), getProductDetail)
router.post('/filter-dish', verifyToken, authorize([0]), filterProduct)

//category
router.post('/add-new-category', verifyToken, authorize([0]), addCategory)
router.delete('/delete-category', verifyToken, authorize([0]), deleteCategories)
router.put('/update-category', verifyToken, authorize([0]), updateCategory)

router.get('/get-all-categories', verifyToken, authorize([0,1]), getAllCategories)
router.get('/get-categories', verifyToken, authorize([0,1]), getCategories)
router.get('/category/detail', verifyToken, authorize([0]), getCategoryDetail)
router.get('/get-parent-category', verifyToken, authorize([0,1]), getAllCategoriesPerent)
router.get('/get-dish-by-id-category', verifyToken, authorize([0,1]), getDishByIdCategories)

export default router