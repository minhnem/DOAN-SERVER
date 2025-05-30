"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_1 = require("../controller/supplier");
const authorize_1 = require("../middlewares/authorize");
const verifyToken_1 = require("../middlewares/verifyToken");
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.getSuppliers);
router.get('/get-form', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.getForm);
router.get('/get-supplier-detail', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.getSupplierDetail);
router.post('/get-export-data', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.getDatas);
router.post('/add-new', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.addNew);
router.put('/update', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.updateSupplier);
router.delete('/delete', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), supplier_1.deleteSupplier);
exports.default = router;
//# sourceMappingURL=supplierRouter.js.map