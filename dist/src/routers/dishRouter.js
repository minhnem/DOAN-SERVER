"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dishes_1 = require("../controller/dishes");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
//dish
router.get('/', dishes_1.getProducts);
router.get('/get-all-dish', dishes_1.getAllProduct);
router.post('/add-new-dish', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.addProduct);
router.delete('/delete-dish', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.deleteProduct);
router.put('/update-dish', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.updateProduct);
router.get('/get-dish-detail', dishes_1.getProductDetail);
router.post('/filter-dish', dishes_1.filterProduct);
//category
router.post('/add-new-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.addCategory);
router.delete('/delete-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.deleteCategories);
router.put('/update-category', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dishes_1.updateCategory);
router.get('/get-all-categories', dishes_1.getAllCategories);
router.get('/get-categories', dishes_1.getCategories);
router.get('/category/detail', dishes_1.getCategoryDetail);
router.get('/get-parent-category', dishes_1.getAllCategoriesPerent);
router.get('/get-dish-by-id-category', dishes_1.getDishByIdCategories);
exports.default = router;
//# sourceMappingURL=dishRouter.js.map