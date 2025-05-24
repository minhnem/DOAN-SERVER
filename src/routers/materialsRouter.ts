import { Router } from "express";
import { 
    addCategoryMaterials, 
    addMaterials, 
    deleteCategoriesMaterials, 
    deleteMaterials, 
    filterMaterials, 
    getAllCategoriesMaterials, 
    getAllMaterials, 
    getCategoriesMaterials, 
    getCategoryMaterialsDetail, 
    getMaterials, 
    getMaterialsDetail, 
    updateCategoryMaterials, 
    updateMaterials 
} from "../controller/materials";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()


//Materials
router.get('/', verifyToken, authorize([0]), getMaterials)
router.get('/get-all-materials', verifyToken, authorize([0]), getAllMaterials)
router.post('/add-new-materials', verifyToken, authorize([0]), addMaterials)
router.delete('/delete-materials', verifyToken, authorize([0]), deleteMaterials)
router.put('/update-materials', verifyToken, authorize([0]), updateMaterials)
router.get('/get-materials-detail', verifyToken, authorize([0]), getMaterialsDetail)
router.post('/filter-materials', verifyToken, authorize([0]), filterMaterials)

//Category
router.post('/add-new-category', verifyToken, authorize([0]), addCategoryMaterials)
router.delete('/delete-category', verifyToken, authorize([0]), deleteCategoriesMaterials)
router.put('/update-category', verifyToken, authorize([0]), updateCategoryMaterials)

router.get('/get-all-categories', verifyToken, authorize([0]), getAllCategoriesMaterials)
router.get('/get-categories', verifyToken, authorize([0]), getCategoriesMaterials)
router.get('/category/detail', verifyToken, authorize([0]), getCategoryMaterialsDetail)

export default router