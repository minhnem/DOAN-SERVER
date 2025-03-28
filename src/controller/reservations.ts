import ReservationsModel from "../models/ReservationsModel"
import TableModel from "../models/TableModel"

const addNewReservations = async (req: any, res: any) => {
    const body = req.body
    
    try {
        const reservations = new ReservationsModel(body)
        await reservations.save()

        res.status(200).json({
            message: 'Thêm 1 thông tin đặt bàn thành công.',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllReservations = async (req: any, res: any) => {
    try {
        const reservations = await ReservationsModel.find({})
        res.status(200).json({
            message: 'Thành công',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeReservations = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await ReservationsModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa thông tin đặt bàn thành công.',
            data: {}
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateReservations = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const reservations = await ReservationsModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật thông tin đặt bàn thành công.',
            data: reservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNewReservations, getAllReservations, updateReservations, removeReservations}