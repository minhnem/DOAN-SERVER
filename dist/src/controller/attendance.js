"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimePersonnelAttendance = exports.getAllAttendance = exports.addNewAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const PersonnelModel_1 = __importDefault(require("../models/PersonnelModel"));
const addNewAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const Attendance = new Attendance_1.default(body);
        const newAttendance = yield Attendance.save();
        res.status(200).json({
            message: 'Chấm công thành công.',
            data: newAttendance
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewAttendance = addNewAttendance;
const getAllAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Attendance = yield Attendance_1.default.find({});
        res.status(200).json({
            message: 'Thành công',
            data: Attendance
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllAttendance = getAllAttendance;
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
const getTimes = (timeType) => {
    let start = new Date();
    let end = new Date();
    const now = new Date();
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
    return { start, end };
};
const getData = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        createdAt: {
            $gte: new Date(start.setHours(0, 0, 0, 0)),
            $lte: new Date(end.setHours(23, 59, 59, 999))
        }
    };
    const attendance = yield Attendance_1.default.find(filter);
    const totaAttendance = attendance.length;
    return totaAttendance;
});
const getTimePersonnelAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { timeType } = req.query;
    try {
        const dates = getTimes(timeType);
        const personnelAttendance = yield getPersonnelAttendance(dates.start, dates.end);
        res.status(200).json({
            message: 'Thành công',
            data: personnelAttendance,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getTimePersonnelAttendance = getTimePersonnelAttendance;
const getPersonnelAttendance = (startAt, endAt) => __awaiter(void 0, void 0, void 0, function* () {
    const personnel = yield PersonnelModel_1.default.find({}).lean();
    const promises = personnel.map((personnel) => __awaiter(void 0, void 0, void 0, function* () {
        const filter = {
            personnelId: personnel._id,
            createdAt: {
                $gte: new Date(startAt.setHours(0, 0, 0, 0)),
                $lte: new Date(endAt.setHours(23, 59, 59, 999))
            }
        };
        const attendance = yield Attendance_1.default.find(filter);
        return Object.assign(Object.assign({}, personnel), { totalAttendance: attendance.length });
    }));
    const personnelAttendance = yield Promise.all(promises);
    return personnelAttendance;
});
//# sourceMappingURL=attendance.js.map