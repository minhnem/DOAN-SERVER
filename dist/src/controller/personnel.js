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
exports.updatePersonnel = exports.removePersonnel = exports.getAllPersonnel = exports.addNewPersonnel = void 0;
const PersonnelModel_1 = __importDefault(require("../models/PersonnelModel"));
const addNewPersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const item = yield PersonnelModel_1.default.findOne({ email: body.email });
        if (item && Object.keys(item).length > 0) {
            throw new Error('Nhân viên này đã tồn tại');
        }
        const personnel = new PersonnelModel_1.default(body);
        const newPersonnel = yield personnel.save();
        res.status(200).json({
            message: 'Thêm 1 thông tin đặt bàn thành công.',
            data: newPersonnel
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNewPersonnel = addNewPersonnel;
const getAllPersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personnel = yield PersonnelModel_1.default.find({});
        res.status(200).json({
            message: 'Thành công',
            data: personnel
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllPersonnel = getAllPersonnel;
const getAllPersonnelAttendence = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personnel = yield PersonnelModel_1.default.find({});
        res.status(200).json({
            message: 'Thành công',
            data: personnel
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
const removePersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const item = yield PersonnelModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa thông tin đặt bàn thành công.',
            data: item
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.removePersonnel = removePersonnel;
const updatePersonnel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const personnel = yield PersonnelModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Cập nhật thông tin đặt bàn thành công.',
            data: personnel
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updatePersonnel = updatePersonnel;
//# sourceMappingURL=personnel.js.map