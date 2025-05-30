"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const table_1 = require("../controller/table");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.getAllTable);
router.get('/get-table-reservations', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.getTableReservations);
router.post('/add-new-table', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.addNewTable);
router.put('/update-table', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.updateTable);
router.delete('/delete-table', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.removeTable);
router.put('/update-status-table', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), table_1.updateStatusTable);
exports.default = router;
//# sourceMappingURL=tableRouter.js.map