import OrderModel from "../models/OrderModel"

const addNewOrder = async (req: any, res: any) => {
    const body = req.body
    const {dishId, tableId} = req.query
    try {
        if(dishId && tableId) {
            const orderUpdate = await OrderModel.findOneAndUpdate({dishId: dishId, tableId: tableId, isDeleted: false}, body)
            res.status(200).json({
                message: 'Cập nhật order thành công.',
                data: orderUpdate
            })
        } else {
            const order = new OrderModel(body)
            await order.save()
            res.status(200).json({
                message: 'Đặt món thành công.',
                data: order
            })
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removeMenuItemInOrder = async (req: any, res: any) => {
    const query = req.query
    const {id, tableId} = query
    try {
        const item = await OrderModel.findOneAndDelete({dishId: id, tableId: tableId})
        res.status(200).json({
            message: 'Sửa/xóa order thành công.',
            data: item
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


const getOrder = async (req: any, res: any) => {
    const query = req.query
    const {tableId} = query
    try {
        const item = await OrderModel.find({tableId: tableId, isDeleted: false})
        if(item.length > 0) {
            res.status(200).json({
                message: 'Lấy order thành công.',
                data: item
            })
        } else {
            res.status(200).json({
                message: 'Bàn này vẫn chưa có món ăn nào được gọi',
                data: []
            })
        }
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


export {addNewOrder, removeMenuItemInOrder, getOrder}