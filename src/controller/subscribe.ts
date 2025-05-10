import SubscribeModel from "../models/SubscribeModel"

const addNewSubscribe = async (req: any, res: any) => {
    const body = req.body
    try {

        const Attendance = new SubscribeModel(body)
        const newAttendance = await Attendance.save()

        res.status(200).json({
            message: 'Chấm công thành công.',
            data: newAttendance
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

export { addNewSubscribe }