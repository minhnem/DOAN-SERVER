import PromotionModel from "../models/PromotionModel"
import SubscribeModel from "../models/SubscribeModel"
import { handleSendEmail } from "../utils/handleSendEmail"

const addNew = async (req: any, res: any) => {
    const body = req.body
    const {code} = body
    try {
        const item = await PromotionModel.findOne({code})
        if(item) {
            throw new Error('Mã code này đã tồn tại!!!')
        }

        const promotion = new PromotionModel(body)
        await promotion.save()

        res.status(200).json({
            message: 'Thêm khuyến mại/giảm giá thành công.',
            data: promotion
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getPromotion = async (req: any, res: any) => {
    try {
        const promotions = await PromotionModel.find({})
        res.status(200).json({
            message: 'Lấy thông tin khuyến mại/giảm giá thành công',
            data: promotions
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removePromotion = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await PromotionModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa chương trình khuyến mại/giảm giá thành công.',
            data: {}
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updatePromotion = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const promotion = await PromotionModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật chương trình khuyến mại/giảm giá thành công.',
            data: promotion
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const checkPromotion = async (req: any, res: any) => {
    const query = req.query
    const {value} = query
    try {
        const item = await PromotionModel.findOne({code: value})
        if(item && item.endAt && item.startAt) {
            const startDate = new Date(item.startAt)
            const endDate = new Date(item.endAt)
            const dateNow = new Date()
            if(dateNow > endDate) {
                throw new Error('Mã giảm giá đã hết hạn')
            } else if (dateNow < startDate) {
                throw new Error('Mã giảm giá không hợp lệ')
            } else {
                res.status(200).json({
                    message: 'Áp mã giảm giá thành công',
                    data: item
                })
            }
        } else {
            throw new Error('Mã giảm giá không tồn tại!!')
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const handleNotification = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const code = await PromotionModel.findById(id)
        const allEmail = await SubscribeModel.find({}).lean()
        for(const item of allEmail) {
            await handleSendEmail({
                from: 'Nhà hàng Hải Dương',
                to: item.email,
                subject: "🎉 Ưu đãi đặc biệt dành cho bạn – Mã giảm giá mới!",
                text: `Chào bạn! Nhà hàng Hải Dương gửi tặng bạn một mã giảm giá đặc biệt. Đừng bỏ lỡ!`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #d6336c;">🎁 Mã Giảm Giá Đặc Biệt Dành Riêng Cho Bạn!</h2>
                            <p>Nhà hàng <strong>Hải Dương</strong> xin gửi tặng bạn một ưu đãi đặc biệt như lời cảm ơn vì đã đồng hành cùng chúng tôi.</p>
                            
                            <h3>✨ Chi tiết ưu đãi:</h3>
                            <ul style="line-height: 1.6;">
                                <li><strong>Mã giảm giá:</strong> <span style="color: #2b6cb0; font-size: 18px;"><strong>${code?.code}</strong></span></li>
                                <li><strong>Giá trị:</strong>${code?.value}</li>
                                <li><strong>Thời hạn sử dụng:</strong> Đến hết ngày ${code?.endAt}</li>
                            </ul>
                            
                            <p style="margin-top: 20px;">Nhanh tay sử dụng mã giảm giá khi đặt bàn hoặc đến trực tiếp nhà hàng nhé!</p>
                            
                            <p style="margin-top: 30px;">Trân trọng,</p>
                            <p><strong>Nhà hàng Hải Dương</strong></p>
                        </div>
                    </div>
                `,
            });
        }

        res.status(200).json({
            message: 'Cập nhật chương trình khuyến mại/giảm giá thành công.',
            data: ''
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export { addNew, getPromotion, removePromotion, updatePromotion, checkPromotion, handleNotification }