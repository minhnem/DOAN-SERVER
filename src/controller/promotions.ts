import PromotionModel from "../models/PromotionModel"

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

export { addNew, getPromotion, removePromotion, updatePromotion, checkPromotion }