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

const router = Router()


//Materials
router.get('/', getMaterials)
router.get('/get-all-materials', getAllMaterials)
router.post('/add-new-materials', addMaterials)
router.delete('/delete-materials', deleteMaterials)
router.put('/update-materials', updateMaterials)
router.get('/get-materials-detail', getMaterialsDetail)
router.post('/filter-materials', filterMaterials)

//Category
router.post('/add-new-category', addCategoryMaterials)
router.delete('/delete-category', deleteCategoriesMaterials)
router.put('/update-category', updateCategoryMaterials)

router.get('/get-all-categories', getAllCategoriesMaterials)
router.get('/get-categories', getCategoriesMaterials)
router.get('/category/detail', getCategoryMaterialsDetail)

export default router