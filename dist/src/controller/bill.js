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
exports.addNewBill = void 0;
const BillModel_1 = __importDefault(require("../models/BillModel"));
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const ReservationsModel_1 = __importDefault(require("../models/ReservationsModel"));
const TableModel_1 = __importDefault(require("../models/TableModel"));
const addNewBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const bill = new BillModel_1.default(body);
        yield bill.save();
        if (bill) {
            yield OrderModel_1.default.deleteMany({ tableId: body.tableId });
            const reservations = yield ReservationsModel_1.default.find({ table_id: body.tableId });
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            if (reservations.length === 2) {
                yield ReservationsModel_1.default.findOneAndDelete({ table_id: body.tableId, reservation_time: '10:00 - 14:00', reservation_date: { $gte: startOfDay, $lte: endOfDay } });
            }
            else {
                yield ReservationsModel_1.default.findOneAndDelete({ table_id: body.tableId, reservation_date: { $gte: startOfDay, $lte: endOfDay } });
            }
            yield TableModel_1.default.findOneAndUpdate({ _id: body.tableId }, { status: 'Trống' });
        }
        res.status(200).json({
            message: 'Thêm mới bill thành công',
            data: bill
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewBill = addNewBill;
//# sourceMappingURL=bill.js.map