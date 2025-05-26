import FeedbackModel from "../models/FeedbackModel"
import { handleSendEmail } from "../utils/handleSendEmail"

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
        const feedback = await FeedbackModel.findByIdAndUpdate(id, {status: 'Đã phản hồi'})
        if(feedback?.email) {
            await handleSendEmail({
                from: 'Nhà hàng Hải Dương',
                to: feedback.email,
                subject: "📩 Phản hồi từ Nhà hàng Hải Dương",
                text: `Chào bạn, chúng tôi đã nhận được phản hồi của bạn và xin gửi lại câu trả lời như sau: ${body.content}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #2b6cb0;">📩 Phản hồi từ Nhà hàng Hải Dương</h2>
                            <p>Chào bạn,</p>
                            <p>Chúng tôi xin chân thành cảm ơn bạn đã gửi phản hồi đến Nhà hàng <strong>Hải Dương</strong>.</p>
                            <p>Sau đây là nội dung phản hồi của chúng tôi:</p>
                            <div style="border-left: 4px solid #2b6cb0; padding-left: 15px; margin: 20px 0; color: #333;">
                                ${body.content}
                            </div>
                            <p>Hy vọng phản hồi của chúng tôi giúp bạn hài lòng. Rất mong được tiếp tục phục vụ bạn trong thời gian tới.</p>
                            <p style="margin-top: 30px;">Trân trọng,</p>
                            <p><strong>Nhà hàng Hải Dương</strong></p>
                        </div>
                    </div>
                `,
            });
        }
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