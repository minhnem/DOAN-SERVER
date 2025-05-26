import { Router } from "express";
import { addNewFeedback, getAllFeedbackStatus, getFeedbackById, removeFeedback, replyFeedback, updateFeedback } from "../controller/feedback";
import { verifyToken } from "../middlewares/verifyToken";
import { authorize } from "../middlewares/authorize";

const router = Router()

router.put('/update-feedback', verifyToken, authorize([0,1]), updateFeedback)
router.put('/reply-feedback', verifyToken, authorize([0,1]), replyFeedback)
router.get('/get-table-feedback', verifyToken, authorize([0,1]), getFeedbackById)
router.post('/add-new-feedback', addNewFeedback)
router.delete('/delete-feedback', verifyToken, authorize([0,1]), removeFeedback)
router.get('/get-feedback-status', verifyToken, authorize([0,1]), getAllFeedbackStatus)

export default router