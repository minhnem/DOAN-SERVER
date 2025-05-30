"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promotions_1 = require("../controller/promotions");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/', promotions_1.getPromotion);
router.post('/add-promotion', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), promotions_1.addNew);
router.put('/update-promotion', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), promotions_1.updatePromotion);
router.delete('/delete-promotion', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), promotions_1.removePromotion);
router.get('/check-promotion', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), promotions_1.checkPromotion);
router.get('/notifycation', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), promotions_1.handleNotification);
exports.default = router;
//# sourceMappingURL=promotionRouter.js.map