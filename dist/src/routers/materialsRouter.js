"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materials_1 = require("../controller/materials");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
//Materials
router.get('/', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getMaterials);
router.get('/get-all-materials', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getAllMaterials);
router.post('/add-new-materials', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.addMaterials);
router.delete('/delete-materials', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.deleteMaterials);
router.put('/update-materials', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.updateMaterials);
router.get('/get-materials-detail', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getMaterialsDetail);
router.post('/filter-materials', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.filterMaterials);
//Category
router.post('/add-new-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.addCategoryMaterials);
router.delete('/delete-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.deleteCategoriesMaterials);
router.put('/update-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.updateCategoryMaterials);
router.get('/get-all-categories', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getAllCategoriesMaterials);
router.get('/get-categories', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getCategoriesMaterials);
router.get('/category/detail', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), materials_1.getCategoryMaterialsDetail);
exports.default = router;
//# sourceMappingURL=materialsRouter.js.map