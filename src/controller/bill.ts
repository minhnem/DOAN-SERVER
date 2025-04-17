import BillModel from "../models/BillModel"
import OrderModel from "../models/OrderModel"
import ReservationModel from "../models/ReservationsModel"
import TableModel from "../models/TableModel"

const addNewBill = async (req: any, res: any) => {
    const body = req.body
    try {
        const bill = new BillModel(body)
        await bill.save()

        if(bill) {
            await OrderModel.deleteMany({tableId: body.tableId})
            const reservations = await ReservationModel.find({table_id: body.tableId})
            
            const today = new Date();
            const startOfDay = new Date(today)
            startOfDay.setHours(0,0,0,0)
            const endOfDay = new Date(today)
            endOfDay.setHours(23, 59, 59, 999)
            if(reservations.length === 2) {
                await ReservationModel.findOneAndDelete({table_id: body.tableId, reservation_time: '10:00 - 14:00', reservation_date: {$gte: startOfDay, $lte: endOfDay}})
            } else {
                await ReservationModel.findOneAndDelete({table_id: body.tableId, reservation_date: {$gte: startOfDay, $lte: endOfDay}})
            }
            await TableModel.findOneAndUpdate({_id: body.tableId}, {status: 'Trống'})
        }

        res.status(200).json({
            message: 'Thêm mới bill thành công',
            data: bill
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


export {addNewBill}
