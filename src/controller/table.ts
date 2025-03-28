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

const getAllTable = async (req: any, res: any) => {
    try {
        const table = await TableModel.find({})
        res.status(200).json({
            message: 'Lấy tất cả các bàn ăn ra thành công',
            data: table
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

export {addNewTable, getAllTable, updateTable, removeTable}