import SupplierModel from "../models/SupplierModel"

const addNew = async (req: any, res: any) => {
    const body = req.body
    try {
        const newSupplier = new SupplierModel(body)
        await newSupplier.save()
        
        res.status(200).json({
            message: 'Thêm mới nhà cung cấp thành công.',
            data: newSupplier
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updateSupplier = async (req: any, res: any) => {
    const body = req.body
    const { id } = req.query
    try {
        await SupplierModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Sửa thông tin thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const deleteSupplier = async (req: any, res: any) => {
    const {id} = req.query
    try {
        await SupplierModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa nhà cung cấp thành công.',
            data: []
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getSuppliers = async (req: any, res: any) => {
    const {pageSize, page} = req.query
    try {
        const skip = (page - 1) * pageSize
        const suppliers = await SupplierModel.find({}).skip(skip).limit(pageSize)
        const total = await SupplierModel.countDocuments()
        res.status(200).json({
            message: 'Danh sách nhà cung cấp.',
            data: {
                suppliers,
                total
            }
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getSupplierDetail = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const supplier = await SupplierModel.findById(id)
        res.status(200).json({
            message: 'Danh sách nhà cung cấp.',
            data: supplier
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getDatas =  async (req: any, res: any) => {
    const body = req.body
    const {start, end} = req.query
    
    try {
        const filter: any = {}
        if(start && end) {
            filter.createdAt = {
                $gte: start,
                $lte: end
            }
        }
        const suppliers = await SupplierModel.find(filter)
        const items: any =  []
        if(body.length > 0) {
            suppliers.forEach((item: any) => {
                const value: any = {}
                body.forEach((key: string) => {
                    value[`${key}`] = `${item._doc[`${key}`] ?? ''}`
                })
                items.push(value)
            })
        }
        
        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: items.length > 0 ? items : suppliers
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getForm = async (req: any, res: any)=> {
    try {
        const form = {
            title: 'Supplier',
            layout: 'horizontal',
            labelCal: 6,
            wrapperCol: 18,
            formItems: [
                {
                    key: 'name',
                    value: 'name',
                    label: 'Supplier name',
                },
                {
                    key: 'product',
                    value: 'product',
                    label: 'Product',
                },
                {
                    key: 'price',
                    value: 'price',
                    label: 'Price',
                },
                {
                    key: 'email',
                    value: 'email',
                    label: 'Email',
                },
                {
                    key: 'contact',
                    value: 'contact',
                    label: 'Contact',
                },
            ]
        }

        res.status(200).json({
            message: '',
            data: form
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export {addNew, getSuppliers, updateSupplier, deleteSupplier, getForm, getDatas, getSupplierDetail}
