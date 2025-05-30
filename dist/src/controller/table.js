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
exports.updateStatusTable = exports.getTableReservations = exports.removeTable = exports.updateTable = exports.getAllTable = exports.addNewTable = void 0;
const ReservationsModel_1 = __importDefault(require("../models/ReservationsModel"));
const TableModel_1 = __importDefault(require("../models/TableModel"));
const addNewTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { slug } = body;
    try {
        const item = yield TableModel_1.default.findOne({ slug });
        if (item) {
            throw new Error('Bàn này đã tồn tại!!!');
        }
        const table = new TableModel_1.default(body);
        yield table.save();
        res.status(200).json({
            message: 'Thêm 1 bàn ăn mới thành công.',
            data: table
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewTable = addNewTable;
const getTableReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, date, time } = req.query;
    try {
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const reservations = yield ReservationsModel_1.default.findOne({ table_id: id, reservation_time: time, reservation_date: { $gte: startOfDay, $lte: endOfDay } });
        const table = yield TableModel_1.default.findById(id);
        const tableDetail = Object.assign(Object.assign({}, table._doc), { reservations: reservations });
        res.status(200).json({
            message: 'Lấy tất cả các bàn ăn ra thành công',
            data: tableDetail
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getTableReservations = getTableReservations;
const getAllTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query;
    try {
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const tables = yield TableModel_1.default.find({});
        const tablesWithReservations = yield Promise.all(tables.map((table) => __awaiter(void 0, void 0, void 0, function* () {
            const reservations = yield ReservationsModel_1.default.find({
                table_id: table._id,
                status: 'Đã xác nhận',
                reservation_date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });
            return Object.assign(Object.assign({}, table._doc), { reservations });
        })));
        res.status(200).json({
            message: 'Lấy tất cả các bàn ăn ra thành công',
            data: tablesWithReservations
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllTable = getAllTable;
const removeTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const table = yield TableModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa bàn ăn thành công.',
            data: table
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.removeTable = removeTable;
const updateTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const table = yield TableModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Cập nhật bàn ăn thành công.',
            data: table
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateTable = updateTable;
const updateStatusTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const table = yield TableModel_1.default.findByIdAndUpdate(id, { status: 'Đang phục vụ' });
        res.status(200).json({
            message: 'Cập nhật bàn ăn thành công.',
            data: table
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateStatusTable = updateStatusTable;
//# sourceMappingURL=table.js.map