import AttendanceModel from "../models/Attendance"
import PersonnelModel from "../models/PersonnelModel"


const addNewAttendance = async (req: any, res: any) => {
    const body = req.body
    try {

        const Attendance = new AttendanceModel(body)
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

const getAllAttendance = async (req: any, res: any) => {
    try {
        const Attendance = await AttendanceModel.find({})
        res.status(200).json({
            message: 'Thành công',
            data: Attendance
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

// const removeAttendance = async (req: any, res: any) => {
//     const {id} = req.query
//     try {
//         const item = await AttendanceModel.findByIdAndDelete(id)
//         res.status(200).json({
//             message: 'Xóa thông tin đặt bàn thành công.',
//             data: item
//         })
//     } catch (error: any) {
//         res.status(404).json({
//             message: error.message
//         })
//     }
// }

// const updateAttendance = async (req: any, res: any) => {
//     const body = req.body
//     const {id} = req.query
//     try {
//         const Attendance = await AttendanceModel.findByIdAndUpdate(id, body)
//         res.status(200).json({
//             message: 'Cập nhật thông tin đặt bàn thành công.',
//             data: Attendance
//         })
//     } catch (error: any) {
//         res.status(404).json({
//             message: error.message
//         })
//     }
// }

const getTimes = (timeType: string) => {
    let start = new Date()
    let end = new Date()
    const now = new Date()

    switch (timeType) {
        case 'Ngày': {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);

            end = new Date(now);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'Tuần': {
            const currentDay = now.getDay();
            const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
            start = new Date(now);
            start.setDate(now.getDate() + mondayOffset);
            start.setHours(0, 0, 0, 0);

            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'Tháng': {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case 'Năm': {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31);
            end.setHours(23, 59, 59, 999);
            break;
        }
    }

    return {start, end}
}

const getData = async (start: Date, end: Date) => {
    const filter = {
        createdAt: {
            $gte: new Date(start.setHours(0, 0, 0, 0)),
            $lte: new Date(end.setHours(23, 59, 59, 999))
        }
    };

    const attendance = await AttendanceModel.find(filter);
    const totaAttendance = attendance.length

    return totaAttendance
}

const getTimePersonnelAttendance = async (req: any, res: any) => {
    const {timeType} = req.query
    try {
        const dates = getTimes(timeType);

        const personnelAttendance = await getPersonnelAttendance(dates.start, dates.end)

        res.status(200).json({
            message: 'Thành công',
            data: personnelAttendance,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message
        })
    }
}

const getPersonnelAttendance = async (startAt: Date, endAt: Date) => {

    const personnel = await PersonnelModel.find({}).lean()

    const promises = personnel.map(async (personnel) => {
        const filter = {
            personnelId: personnel._id,
            createdAt: {
                $gte: new Date(startAt.setHours(0, 0, 0, 0)),
                $lte: new Date(endAt.setHours(23, 59, 59, 999))
            }
        }
        const attendance = await AttendanceModel.find(filter);

        return {
            ...personnel,
            totalAttendance: attendance.length
        }
    })

    const personnelAttendance = await Promise.all(promises)

    return personnelAttendance
}


export {
    addNewAttendance,
    getAllAttendance,
    getTimePersonnelAttendance,
    // removeAttendance,
    // updateAttendance,
}