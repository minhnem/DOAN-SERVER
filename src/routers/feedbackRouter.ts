import { Router } from "express";
import { addNewFeedback, getAllFeedbackStatus, getFeedbackById, removeFeedback, replyFeedback, updateFeedback } from "../controller/feedback";

const router = Router()

router.put('/update-feedback', updateFeedback)
router.put('/reply-feedback', replyFeedback)
router.get('/get-table-feedback', getFeedbackById)
router.post('/add-new-feedback', addNewFeedback)
router.delete('/delete-feedback', removeFeedback)
router.get('/get-feedback-status', getAllFeedbackStatus)

export default router