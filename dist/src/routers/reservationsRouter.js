"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservations_1 = require("../controller/reservations");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.put('/update-reservations', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), reservations_1.updateReservations);
router.get('/get-table-reservations', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), reservations_1.getReservationsById);
router.post('/add-new-reservations', reservations_1.addNewReservations);
router.delete('/delete-reservations', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), reservations_1.removeReservations);
router.get('/get-reservations-status', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), reservations_1.getAllReservationsStatus);
exports.default = router;
//# sourceMappingURL=reservationsRouter.js.map