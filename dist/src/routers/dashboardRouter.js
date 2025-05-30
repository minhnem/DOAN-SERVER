"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_1 = require("../controller/dashboard");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dashboard_1.getAllData);
router.get('/get-data-chart', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), dashboard_1.getDataChart);
exports.default = router;
//# sourceMappingURL=dashboardRouter.js.map