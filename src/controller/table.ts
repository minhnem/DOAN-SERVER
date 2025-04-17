import ReservationModel from "../models/ReservationsModel"
import TableModel from "../models/TableModel"

const addNewTable = async (req: any, res: any) => {
    const body = req.body
    const {slug} = body
    try {
        const item = await TableModel.findOne({slug})
        if(item) {
            throw new Error('Bàn này đã tồn tại!!!')
        }

        const table = new TableModel(body)
        await table.save()

        res.status(200).json({
            message: 'Thêm 1 bàn ăn mới thành công.',
            data: table
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getTableReservations = async (req: any, res: any) => {
    const {id, date, time} = req.query
    try {
        const targetDate = date ? new Date(date) : new Date()
        const startOfDay = new Date(targetDate)
        startOfDay.setHours(0,0,0,0)

        const endOfDay = new Date(targetDate)
        endOfDay.setHours(23, 59, 59, 999)

        const reservations: any = await ReservationModel.findOne({table_id: id, reservation_time: time, reservation_date: {$gte: startOfDay, $lte: endOfDay}})
        const table: any = await TableModel.findById(id)
        const tableDetail = {...table._doc, reservations: reservations}
        res.status(200).json({
            message: 'Lấy tất cả các bàn ăn ra thành công',
            data: tableDetail
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllTable = async (req: any, res: any) => {
    const {date} = req.query
    try {

        const targetDate = date ? new Date(date) : new Date()
        const startOfDay = new Date(targetDate)
        startOfDay.setHours(0,0,0,0)

        const endOfDay = new Date(targetDate)
        endOfDay.setHours(23, 59, 59, 999)

        const tables = await TableModel.find({})
        const tablesWithReservations = await Promise.all(
            tables.map(async (table: any) => {
                const reservations = await ReservationModel.find({
                    table_id: table._id,
                    reservation_date: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                });

                return {
                    ...table._doc,
                    reservations
                };
            })
        );
        res.status(200).json({
            message: 'Lấy tất cả các bàn ăn ra thành công',
            data: tablesWithReservations
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeTable = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const table = await TableModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa bàn ăn thành công.',
            data: table
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateTable = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const table = await TableModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật bàn ăn thành công.',
            data: table
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateStatusTable = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const table = await TableModel.findByIdAndUpdate(id, {status: 'Đang phục vụ'})
        res.status(200).json({
            message: 'Cập nhật bàn ăn thành công.',
            data: table
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNewTable, getAllTable, updateTable, removeTable, getTableReservations, updateStatusTable}