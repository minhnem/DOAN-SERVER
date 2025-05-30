"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedback_1 = require("../controller/feedback");
const verifyToken_1 = require("../middlewares/verifyToken");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.put('/update-feedback', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), feedback_1.updateFeedback);
router.put('/reply-feedback', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), feedback_1.replyFeedback);
router.get('/get-table-feedback', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), feedback_1.getFeedbackById);
router.post('/add-new-feedback', feedback_1.addNewFeedback);
router.delete('/delete-feedback', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), feedback_1.removeFeedback);
router.get('/get-feedback-status', verifyToken_1.verifyToken, (0, authorize_1.authorize)([0, 1]), feedback_1.getAllFeedbackStatus);
exports.default = router;
//# sourceMappingURL=feedbackRouter.js.map