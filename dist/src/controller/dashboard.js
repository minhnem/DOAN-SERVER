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
exports.getDataChart = exports.getAllData = void 0;
const BillModel_1 = __importDefault(require("../models/BillModel"));
const DishModel_1 = __importDefault(require("../models/DishModel"));
const MaterialsModel_1 = __importDefault(require("../models/MaterialsModel"));
const ReservationsModel_1 = __importDefault(require("../models/ReservationsModel"));
const SupplierModel_1 = __importDefault(require("../models/SupplierModel"));
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalReservation = yield ReservationsModel_1.default.countDocuments();
        const material = yield MaterialsModel_1.default.find({});
        const totalMaterial = material.length;
        const costMaterial = material.reduce((a, b) => a + b.cost, 0);
        const totalSupplier = yield SupplierModel_1.default.countDocuments();
        const rejectReservation = yield ReservationsModel_1.default.find({ status: 'Từ chối' });
        const totalRejectReservation = rejectReservation.length;
        const totalDish = yield DishModel_1.default.countDocuments();
        const bills = yield BillModel_1.default.find({});
        const totalBill = bills.length;
        const priceBill = bills.reduce((a, b) => a + b.totalPrice, 0);
        res.status(200).json({
            message: 'Lấy tất cả thông tin thành công.',
            data: {
                totalBill,
                priceBill,
                totalMaterial,
                costMaterial,
                totalSupplier,
                totalDish,
                totalRejectReservation,
            }
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllData = getAllData;
const getDataChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        const allBills = yield getAllbillTime(startOfYear, endOfYear);
        const billsByMonth = Array.from({ length: 12 }, (_, index) => {
            const month = `${index + 1}`;
            const billsInMonth = allBills.filter(bill => {
                const billDate = new Date(bill.createdAt);
                return billDate.getMonth() === index;
            });
            return {
                month,
                total: billsInMonth.reduce((a, b) => a + b.totalPrice, 0),
            };
        });
        res.status(200).json({
            message: 'Lấy hóa đơn theo từng tháng thành công.',
            data: billsByMonth,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
});
exports.getDataChart = getDataChart;
const getAllbillTime = (startAt, endAt) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        createdAt: {
            $gte: new Date(startAt.setHours(0, 0, 0, 0)),
            $lte: new Date(endAt.setHours(23, 59, 59, 999)),
        },
    };
    const bills = yield BillModel_1.default.find(filter);
    return bills;
});
//# sourceMappingURL=dashboard.js.map