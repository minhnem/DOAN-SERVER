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
exports.handleNotification = exports.checkPromotion = exports.updatePromotion = exports.removePromotion = exports.getPromotion = exports.addNew = void 0;
const PromotionModel_1 = __importDefault(require("../models/PromotionModel"));
const SubscribeModel_1 = __importDefault(require("../models/SubscribeModel"));
const handleSendEmail_1 = require("../utils/handleSendEmail");
const addNew = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { code } = body;
    try {
        const item = yield PromotionModel_1.default.findOne({ code });
        if (item) {
            throw new Error('Mã code này đã tồn tại!!!');
        }
        const promotion = new PromotionModel_1.default(body);
        yield promotion.save();
        res.status(200).json({
            message: 'Thêm khuyến mại/giảm giá thành công.',
            data: promotion
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNew = addNew;
const getPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promotions = yield PromotionModel_1.default.find({});
        res.status(200).json({
            message: 'Lấy thông tin khuyến mại/giảm giá thành công',
            data: promotions
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getPromotion = getPromotion;
const removePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield PromotionModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa chương trình khuyến mại/giảm giá thành công.',
            data: {}
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.removePromotion = removePromotion;
const updatePromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const promotion = yield PromotionModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Cập nhật chương trình khuyến mại/giảm giá thành công.',
            data: promotion
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updatePromotion = updatePromotion;
const checkPromotion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { value } = query;
    try {
        const item = yield PromotionModel_1.default.findOne({ code: value });
        if (item && item.endAt && item.startAt) {
            const startDate = new Date(item.startAt);
            const endDate = new Date(item.endAt);
            const dateNow = new Date();
            if (dateNow > endDate) {
                throw new Error('Mã giảm giá đã hết hạn');
            }
            else if (dateNow < startDate) {
                throw new Error('Mã giảm giá không hợp lệ');
            }
            else {
                res.status(200).json({
                    message: 'Áp mã giảm giá thành công',
                    data: item
                });
            }
        }
        else {
            throw new Error('Mã giảm giá không tồn tại!!');
        }
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.checkPromotion = checkPromotion;
const handleNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const code = yield PromotionModel_1.default.findById(id);
        const allEmail = yield SubscribeModel_1.default.find({}).lean();
        for (const item of allEmail) {
            yield (0, handleSendEmail_1.handleSendEmail)({
                from: 'Nhà hàng Hải Dương',
                to: item.email,
                subject: "🎉 Ưu đãi đặc biệt dành cho bạn – Mã giảm giá mới!",
                text: `Chào bạn! Nhà hàng Hải Dương gửi tặng bạn một mã giảm giá đặc biệt. Đừng bỏ lỡ!`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #d6336c;">🎁 Mã Giảm Giá Đặc Biệt Dành Riêng Cho Bạn!</h2>
                            <p>Nhà hàng <strong>Hải Dương</strong> xin gửi tặng bạn một ưu đãi đặc biệt như lời cảm ơn vì đã đồng hành cùng chúng tôi.</p>
                            
                            <h3>✨ Chi tiết ưu đãi:</h3>
                            <ul style="line-height: 1.6;">
                                <li><strong>Mã giảm giá:</strong> <span style="color: #2b6cb0; font-size: 18px;"><strong>${code === null || code === void 0 ? void 0 : code.code}</strong></span></li>
                                <li><strong>Giá trị: </strong>${code === null || code === void 0 ? void 0 : code.value}%</li>
                                <li><strong>Thời hạn sử dụng:</strong> Đến hết ngày ${code === null || code === void 0 ? void 0 : code.endAt}</li>
                            </ul>
                            
                            <p style="margin-top: 20px;">Nhanh tay sử dụng mã giảm giá khi đặt bàn hoặc đến trực tiếp nhà hàng nhé!</p>
                            
                            <p style="margin-top: 30px;">Trân trọng,</p>
                            <p><strong>Nhà hàng Hải Dương</strong></p>
                        </div>
                    </div>
                `,
            });
        }
        res.status(200).json({
            message: 'Cập nhật chương trình khuyến mại/giảm giá thành công.',
            data: ''
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.handleNotification = handleNotification;
//# sourceMappingURL=promotions.js.map