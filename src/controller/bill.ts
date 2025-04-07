import BillModel from "../models/BillModel"
import TableModel from "../models/TableModel"

const addNewBill = async (req: any, res: any) => {
    const body = req.body
    try {
        const bill = new BillModel(body)
        await bill.save()

        if(bill) {
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
