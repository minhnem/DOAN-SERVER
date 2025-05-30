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
exports.getOrder = exports.removeMenuItemInOrder = exports.addNewOrder = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const addNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { dishId, tableId } = req.query;
    try {
        if (dishId && tableId) {
            const orderUpdate = yield OrderModel_1.default.findOneAndUpdate({ dishId: dishId, tableId: tableId, isDeleted: false }, body);
            res.status(200).json({
                message: 'Cập nhật order thành công.',
                data: orderUpdate
            });
        }
        else {
            const order = new OrderModel_1.default(body);
            yield order.save();
            res.status(200).json({
                message: 'Đặt món thành công.',
                data: order
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewOrder = addNewOrder;
const removeMenuItemInOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { id, tableId } = query;
    try {
        const item = yield OrderModel_1.default.findOneAndDelete({ dishId: id, tableId: tableId });
        res.status(200).json({
            message: 'Sửa/xóa order thành công.',
            data: item
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.removeMenuItemInOrder = removeMenuItemInOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { tableId } = query;
    try {
        const item = yield OrderModel_1.default.find({ tableId: tableId, isDeleted: false });
        if (item.length > 0) {
            res.status(200).json({
                message: 'Lấy order thành công.',
                data: item
            });
        }
        else {
            res.status(200).json({
                message: 'Bàn này vẫn chưa có món ăn nào được gọi',
                data: []
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getOrder = getOrder;
//# sourceMappingURL=order.js.map