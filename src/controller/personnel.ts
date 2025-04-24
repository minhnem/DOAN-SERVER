import PersonnelModel from "../models/PersonnelModel"

const addNewPersonnel = async (req: any, res: any) => {
    const body = req.body
    try {

        const item = await PersonnelModel.findOne({email: body.email})
        if(item && Object.keys(item).length > 0) {
            throw new Error('Nhân viên này đã tồn tại')
        }

        const personnel = new PersonnelModel(body)
        const newPersonnel = await personnel.save()

        res.status(200).json({
            message: 'Thêm 1 thông tin đặt bàn thành công.',
            data: newPersonnel
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllPersonnel = async (req: any, res: any) => {
    try {
        const personnel = await PersonnelModel.find({})
        res.status(200).json({
            message: 'Thành công',
            data: personnel
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getAllPersonnelAttendence = async (req: any, res: any) => {
    try {
        const personnel = await PersonnelModel.find({})
        res.status(200).json({
            message: 'Thành công',
            data: personnel
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const removePersonnel = async (req: any, res: any) => {
    const {id} = req.query
    try {
        const item = await PersonnelModel.findByIdAndDelete(id)
        res.status(200).json({
            message: 'Xóa thông tin đặt bàn thành công.',
            data: item
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const updatePersonnel = async (req: any, res: any) => {
    const body = req.body
    const {id} = req.query
    try {
        const personnel = await PersonnelModel.findByIdAndUpdate(id, body)
        res.status(200).json({
            message: 'Cập nhật thông tin đặt bàn thành công.',
            data: personnel
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}


export {
    addNewPersonnel,
    getAllPersonnel,
    removePersonnel,
    updatePersonnel,
}