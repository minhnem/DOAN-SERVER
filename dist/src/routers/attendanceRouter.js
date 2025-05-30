"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_1 = require("../controller/attendance");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.get('/get-time-personnel-attendance', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), attendance_1.getTimePersonnelAttendance);
router.post('/add-attendance', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0]), attendance_1.addNewAttendance);
exports.default = router;
//# sourceMappingURL=attendanceRouter.js.map