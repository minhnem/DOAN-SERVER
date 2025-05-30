"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bill_1 = require("../controller/bill");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.post('/add-new-bill', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), bill_1.addNewBill);
exports.default = router;
//# sourceMappingURL=billRouter.js.map