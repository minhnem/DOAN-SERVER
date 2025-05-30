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
exports.replyFeedback = exports.updateFeedback = exports.removeFeedback = exports.getFeedbackById = exports.getAllFeedbackStatus = exports.addNewFeedback = void 0;
const FeedbackModel_1 = __importDefault(require("../models/FeedbackModel"));
const handleSendEmail_1 = require("../utils/handleSendEmail");
const addNewFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const feedback = new FeedbackModel_1.default(body);
        const item = yield feedback.save();
        res.status(200).json({
            message: 'Thêm 1 thông tin đánh giá thành công.',
            data: feedback
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewFeedback = addNewFeedback;
const getFeedbackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query;
    try {
        const feedback = yield FeedbackModel_1.default.findById(id);
        res.status(200).json({
            message: 'Lấy đánh giá theo id thành công',
            data: feedback
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getFeedbackById = getFeedbackById;
const getAllFeedbackStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { status } = query;
    try {
        const Feedback = yield FeedbackModel_1.default.find({ status: status });
        res.status(200).json({
            message: 'Thành công',
            data: Feedback
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllFeedbackStatus = getAllFeedbackStatus;
const removeFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield FeedbackModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa thông tin đánh giá thành công.',
            data: {}
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.removeFeedback = removeFeedback;
const updateFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const feedback = yield FeedbackModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Cập nhật thông tin đánh giá thành công.',
            data: feedback
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateFeedback = updateFeedback;
const replyFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const feedback = yield FeedbackModel_1.default.findByIdAndUpdate(id, { status: 'Đã phản hồi' });
        if (feedback === null || feedback === void 0 ? void 0 : feedback.email) {
            yield (0, handleSendEmail_1.handleSendEmail)({
                from: 'Nhà hàng Hải Dương',
                to: feedback.email,
                subject: "📩 Phản hồi từ Nhà hàng Hải Dương",
                text: `Chào bạn, chúng tôi đã nhận được phản hồi của bạn và xin gửi lại câu trả lời như sau: ${body.content}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #2b6cb0;">📩 Phản hồi từ Nhà hàng Hải Dương</h2>
                            <p>Chào bạn,</p>
                            <p>Chúng tôi xin chân thành cảm ơn bạn đã gửi phản hồi đến Nhà hàng <strong>Hải Dương</strong>.</p>
                            <p>Sau đây là nội dung phản hồi của chúng tôi:</p>
                            <div style="border-left: 4px solid #2b6cb0; padding-left: 15px; margin: 20px 0; color: #333;">
                                ${body.content}
                            </div>
                            <p>Hy vọng phản hồi của chúng tôi giúp bạn hài lòng. Rất mong được tiếp tục phục vụ bạn trong thời gian tới.</p>
                            <p style="margin-top: 30px;">Trân trọng,</p>
                            <p><strong>Nhà hàng Hải Dương</strong></p>
                        </div>
                    </div>
                `,
            });
        }
        res.status(200).json({
            message: 'Phản hồi dến khách hàng thành công.',
            data: feedback
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.replyFeedback = replyFeedback;
//# sourceMappingURL=feedback.js.map