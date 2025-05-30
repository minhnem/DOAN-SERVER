"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = require("../controller/order");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.post('/add-new-order', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), order_1.addNewOrder);
router.delete('/delete-dish-order', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), order_1.removeMenuItemInOrder);
router.get('/', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), order_1.getOrder);
exports.default = router;
//# sourceMappingURL=orderRouter.js.map