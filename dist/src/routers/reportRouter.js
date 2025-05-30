"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_1 = require("../controller/report");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/get-data-time', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), report_1.getTimeBill);
router.get('/predictions', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), report_1.predictRevenueNextWeek);
router.get('/predict-top-sale', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), report_1.predictTop5Dishes);
exports.default = router;
//# sourceMappingURL=reportRouter.js.map