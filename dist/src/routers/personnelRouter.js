"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personnel_1 = require("../controller/personnel");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/get-all-personnel', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), personnel_1.getAllPersonnel);
router.post('/add-new', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), personnel_1.addNewPersonnel);
router.put('/update-personnel', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), personnel_1.updatePersonnel);
router.delete('/delete-personnel', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), personnel_1.removePersonnel);
exports.default = router;
//# sourceMappingURL=personnelRouter.js.map