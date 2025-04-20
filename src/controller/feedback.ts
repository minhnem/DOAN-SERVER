import FeedbackModel from "../models/FeedbackModel"

const addNewFeedback = async (req: any, res: any) => {
    const body = req.body
    try {
        const feedback = new FeedbackModel(body)
        const item = await feedback.save()

        res.status(200).json({
            message: 'Thêm 1 thông tin đánh giá thành công.',
            data: feedback
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getFeedbackById = async (req: any, res: any) => {
    const id = req.query
    try {
        const feedback = await FeedbackModel.findById(id)
        res.status(200).json({
            message: 'Lấy đánh giá theo id thành công',
            data: feedback
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


const getAllFeedbackStatus = async (req: any, res: any) => {
    const query = req.query
    const {status} = query
    try {
        const Feedback = await FeedbackModel.find({status: status})
        res.status(200).json({
            message: 'Thành công',
            data: Feedback
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeFeedback = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await FeedbackModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa thông tin đánh giá thành công.',
            data: {}
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateFeedback = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const feedback = await FeedbackModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật thông tin đánh giá thành công.',
            data: feedback
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const replyFeedback = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        console.log(body)
        const feedback = await FeedbackModel.findByIdAndUpdate(id, {status: 'Đã phản hồi'})
        res.status(200).json({
            message: 'Phản hồi dến khách hàng thành công.',
            data: feedback
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNewFeedback, getAllFeedbackStatus, getFeedbackById, removeFeedback, updateFeedback, replyFeedback}