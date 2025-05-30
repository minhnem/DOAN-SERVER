"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.predictTop5Dishes = exports.predictRevenueNextWeek = exports.getTimeBill = void 0;
const BillModel_1 = __importDefault(require("../models/BillModel"));
const MaterialsModel_1 = __importDefault(require("../models/MaterialsModel"));
const tf = __importStar(require("@tensorflow/tfjs"));
const getTimes = (timeType) => {
    let start = new Date();
    let end = new Date();
    const now = new Date();
    switch (timeType) {
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
    const bills = yield BillModel_1.default.find(filter);
    const totalBill = bills.length;
    return {
        revenue: bills.reduce((a, b) => a + b.totalPrice, 0),
        totalBill,
        bills
    };
});
const getTimeBill = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { timeType } = req.query;
    try {
        const dates = getTimes(timeType);
        const days = [];
        if (timeType === 'Năm') {
            for (let i = 0; i < 12; i++) {
                days.push(new Date(dates.start.getFullYear(), i, 1));
            }
        }
        else {
            const startDate = new Date(dates.start.getFullYear(), dates.start.getMonth(), dates.start.getDate());
            const endDate = new Date(dates.end.getFullYear(), dates.end.getMonth(), dates.end.getDate());
            const msPerDay = 1000 * 60 * 60 * 24;
            const timeDiff = endDate.getTime() - startDate.getTime();
            const nums = Math.round(timeDiff / msPerDay) + 1;
            for (let i = 0; i < nums; i++) {
                const day = new Date(startDate);
                day.setDate(day.getDate() + i);
                days.push(day);
            }
        }
        const promises = days.map((day) => __awaiter(void 0, void 0, void 0, function* () {
            let start;
            let end;
            if (timeType === 'Năm') {
                start = new Date(day.getFullYear(), day.getMonth(), 1);
                end = new Date(day.getFullYear(), day.getMonth() + 1, 0);
            }
            else {
                start = new Date(day);
                end = new Date(day);
            }
            return {
                date: day,
                data: yield getData(start, end)
            };
        }));
        let bills;
        if (timeType === 'Năm') {
            const start = new Date(days[0].getFullYear(), days[0].getMonth(), 1);
            const end = new Date(days[days.length - 1].getFullYear(), days[days.length - 1].getMonth() + 1, 0);
            bills = yield getAllbillTime(start, end);
        }
        else {
            const start = new Date(days[0]);
            const end = new Date(days[days.length - 1]);
            bills = yield getAllbillTime(start, end);
        }
        const results = yield Promise.all(promises);
        const material = yield MaterialsModel_1.default.find({});
        const costMaterial = material.reduce((a, b) => a + b.cost, 0);
        res.status(200).json({
            message: 'Lấy thông tin thành công.',
            data: {
                results,
                costMaterial,
                bills,
            }
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getTimeBill = getTimeBill;
const getAllbillTime = (startAt, endAt) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {
        createdAt: {
            $gte: new Date(startAt.setHours(0, 0, 0, 0)),
            $lte: new Date(endAt.setHours(23, 59, 59, 999))
        }
    };
    const bills = yield BillModel_1.default.find(filter);
    return bills;
});
//====================================================================//
// Lấy doanh thu mỗi ngày liên tục trong X ngày gần nhất
const getDailyRevenue = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (daysAgo = 56) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    // Lấy dữ liệu gốc từ Mongo
    const rawData = yield BillModel_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                totalRevenue: { $sum: "$totalPrice" },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    // Chuyển sang Map để dễ tra cứu
    const map = new Map();
    rawData.forEach(item => map.set(item._id, item.totalRevenue));
    // Tạo danh sách ngày đầy đủ
    const result = [];
    for (let i = 0; i < daysAgo; i++) {
        const day = new Date();
        day.setDate(day.getDate() - (daysAgo - 1 - i));
        const dateStr = day.toISOString().split("T")[0];
        result.push({
            date: dateStr,
            revenue: map.get(dateStr) || 0,
        });
    }
    return result;
});
const predictRevenueNextWeek = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const history = yield getDailyRevenue(56); // 8 tuần gần nhất
        // Lọc ra các ngày có revenue thực sự
        const filtered = history.filter(item => item.revenue > 0);
        const revenueValues = filtered.map(item => item.revenue);
        //const revenueValues = [244000, 210000, 542000, 346000, 460000, 530000, 650000, 580000, 615000, 650000]
        console.log(revenueValues);
        if (revenueValues.length < 10) {
            return res.status(400).json({ message: "Không đủ dữ liệu để dự đoán." });
        }
        // Normalize
        const max = Math.max(...revenueValues);
        const min = Math.min(...revenueValues);
        const normalized = revenueValues.map(x => (x - min) / (max - min || 1));
        // Tạo tập huấn luyện
        const inputSize = 7;
        const xs = [], ys = [];
        for (let i = 0; i < normalized.length - inputSize; i++) {
            xs.push(normalized.slice(i, i + inputSize));
            ys.push(normalized[i + inputSize]);
        }
        const xsTensor = tf.tensor2d(xs, [xs.length, inputSize]);
        const ysTensor = tf.tensor1d(ys);
        // Mô hình
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 16, inputShape: [inputSize], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
        // model.add(tf.layers.dense({ units: 1, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'softplus' }));
        model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
        yield model.fit(xsTensor, ysTensor, { epochs: 100, verbose: 0 });
        // Dự đoán
        let input = normalized.slice(-inputSize);
        const predictions = [];
        for (let i = 0; i < 7; i++) {
            const inputTensor = tf.tensor2d([input], [1, inputSize]);
            const output = model.predict(inputTensor);
            const predicted = (yield output.array());
            const denormalized = Math.max(0, predicted[0][0] * (max - min) + min);
            predictions.push({
                count: `Ngày ${i + 1}`,
                data: Math.round(denormalized)
            });
            input = [...input.slice(1), predicted[0][0]];
        }
        res.status(200).json({
            message: "Dự đoán doanh thu 7 ngày tới thành công.",
            data: predictions,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.predictRevenueNextWeek = predictRevenueNextWeek;
//=================================================================//
const getDailyDishSales = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (daysAgo = 56) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    const rawData = yield BillModel_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                isDeleted: false,
            },
        },
        { $unwind: "$dishItem" },
        {
            $group: {
                _id: {
                    title: "$dishItem.title",
                    date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                },
                totalCount: { $sum: "$dishItem.count" },
            },
        },
        {
            $group: {
                _id: "$_id.title",
                dailySales: {
                    $push: {
                        date: "$_id.date",
                        count: "$totalCount",
                    },
                },
            },
        },
    ]);
    return rawData;
});
const predictTop5Dishes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield getDailyDishSales(56);
        console.log(JSON.stringify(rawData, null, 2));
        // const rawData = [
        //   {
        //     _id: "Món chính 1",
        //     dailySales: [
        //       { date: "2025-03-19", count: 3 },
        //       { date: "2025-03-22", count: 2 },
        //       { date: "2025-03-27", count: 5 },
        //       { date: "2025-04-01", count: 4 },
        //       { date: "2025-04-10", count: 3 },
        //       { date: "2025-04-18", count: 6 },
        //       { date: "2025-04-25", count: 2 },
        //       { date: "2025-05-05", count: 5 },
        //       { date: "2025-05-10", count: 7 }
        //     ]
        //   },
        //   {
        //     _id: "Đồ uống 1",
        //     dailySales: [
        //       { date: "2025-03-20", count: 1 },
        //       { date: "2025-03-23", count: 2 },
        //       { date: "2025-04-01", count: 2 },
        //       { date: "2025-04-08", count: 3 },
        //       { date: "2025-04-18", count: 2 },
        //       { date: "2025-04-28", count: 3 },
        //       { date: "2025-05-11", count: 4 }
        //     ]
        //   },
        //   {
        //     _id: "Hamburger gà chiên",
        //     dailySales: [
        //       { date: "2025-03-21", count: 3 },
        //       { date: "2025-03-28", count: 2 },
        //       { date: "2025-04-10", count: 3 },
        //       { date: "2025-04-19", count: 2 },
        //       { date: "2025-04-26", count: 2 },
        //       { date: "2025-05-03", count: 3 },
        //       { date: "2025-05-12", count: 5 }
        //     ]
        //   },
        //   {
        //     _id: "Thịt viên chiên",
        //     dailySales: [
        //       { date: "2025-03-19", count: 2 },
        //       { date: "2025-03-26", count: 2 },
        //       { date: "2025-04-05", count: 1 },
        //       { date: "2025-04-12", count: 3 },
        //       { date: "2025-04-19", count: 2 },
        //       { date: "2025-04-26", count: 1 },
        //       { date: "2025-05-10", count: 2 }
        //     ]
        //   },
        //   {
        //     _id: "Món khai vị 1",
        //     dailySales: [
        //       { date: "2025-03-21", count: 1 },
        //       { date: "2025-03-28", count: 2 },
        //       { date: "2025-04-04", count: 2 },
        //       { date: "2025-04-11", count: 1 },
        //       { date: "2025-04-18", count: 3 },
        //       { date: "2025-04-25", count: 2 },
        //       { date: "2025-05-02", count: 1 },
        //       { date: "2025-05-09", count: 4 }
        //     ]
        //   }
        // ];
        const inputSize = 3;
        const predictionDays = 7;
        const dishPredictions = [];
        for (const dish of rawData) {
            const sortedSales = dish.dailySales.sort((a, b) => a.date.localeCompare(b.date));
            const allDays = sortedSales.map((d) => d.count);
            // Chỉ dự đoán khi có đủ số lượng mẫu cần thiết
            if (allDays.length < inputSize + 1)
                continue;
            const max = Math.max(...allDays);
            const min = Math.min(...allDays);
            if (max === min)
                continue;
            const normalized = allDays.map((x) => (x - min) / (max - min));
            const xs = [], ys = [];
            for (let i = 0; i < normalized.length - inputSize; i++) {
                xs.push(normalized.slice(i, i + inputSize));
                ys.push(normalized[i + inputSize]);
            }
            const xsTensor = tf.tensor2d(xs, [xs.length, inputSize]);
            const ysTensor = tf.tensor1d(ys);
            const model = tf.sequential();
            model.add(tf.layers.dense({ units: 16, inputShape: [inputSize], activation: 'relu' }));
            model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
            model.add(tf.layers.dense({ units: 1 }));
            model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
            yield model.fit(xsTensor, ysTensor, { epochs: 100, verbose: 0 });
            let input = normalized.slice(-inputSize);
            const realInput = [...input];
            let total = 0;
            for (let i = 0; i < predictionDays; i++) {
                const inputTensor = tf.tensor2d([realInput], [1, inputSize]);
                const output = model.predict(inputTensor);
                const predArray = yield output.array();
                const predicted = predArray[0][0];
                const denormalized = predicted * (max - min) + min;
                total += denormalized;
            }
            dishPredictions.push({
                title: dish._id,
                totalPredicted: Math.round(total),
            });
            console.log(`Dự đoán món ${dish._id}: ${Math.round(total)}`);
        }
        dishPredictions.sort((a, b) => b.totalPredicted - a.totalPredicted);
        res.status(200).json({
            message: "Dự đoán 5 món bán chạy nhất tuần tới",
            data: dishPredictions.slice(0, 5),
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.predictTop5Dishes = predictTop5Dishes;
//# sourceMappingURL=report.js.map