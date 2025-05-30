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
exports.getSupplierDetail = exports.getDatas = exports.getForm = exports.deleteSupplier = exports.updateSupplier = exports.getSuppliers = exports.addNew = void 0;
const SupplierModel_1 = __importDefault(require("../models/SupplierModel"));
const addNew = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newSupplier = new SupplierModel_1.default(body);
        yield newSupplier.save();
        res.status(200).json({
            message: 'Thêm mới nhà cung cấp thành công.',
            data: newSupplier
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addNew = addNew;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa thông tin thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield SupplierModel_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Xóa nhà cung cấp thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteSupplier = deleteSupplier;
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pageSize, page } = req.query;
    try {
        const skip = (page - 1) * pageSize;
        const suppliers = yield SupplierModel_1.default.find({}).skip(skip).limit(pageSize);
        const total = yield SupplierModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Danh sách nhà cung cấp.',
            data: {
                suppliers,
                total
            }
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getSuppliers = getSuppliers;
const getSupplierDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const supplier = yield SupplierModel_1.default.findById(id);
        res.status(200).json({
            message: 'Danh sách nhà cung cấp.',
            data: supplier
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getSupplierDetail = getSupplierDetail;
const getDatas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { start, end } = req.query;
    try {
        const filter = {};
        if (start && end) {
            filter.createdAt = {
                $gte: start,
                $lte: end
            };
        }
        const suppliers = yield SupplierModel_1.default.find(filter);
        const items = [];
        if (body.length > 0) {
            suppliers.forEach((item) => {
                const value = {};
                body.forEach((key) => {
                    var _a;
                    value[`${key}`] = `${(_a = item._doc[`${key}`]) !== null && _a !== void 0 ? _a : ''}`;
                });
                items.push(value);
            });
        }
        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: items.length > 0 ? items : suppliers
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getDatas = getDatas;
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = {
            title: 'Supplier',
            layout: 'horizontal',
            labelCal: 6,
            wrapperCol: 18,
            formItems: [
                {
                    key: 'name',
                    value: 'name',
                    label: 'Supplier name',
                },
                {
                    key: 'product',
                    value: 'product',
                    label: 'Product',
                },
                {
                    key: 'price',
                    value: 'price',
                    label: 'Price',
                },
                {
                    key: 'email',
                    value: 'email',
                    label: 'Email',
                },
                {
                    key: 'contact',
                    value: 'contact',
                    label: 'Contact',
                },
            ]
        };
        res.status(200).json({
            message: '',
            data: form
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getForm = getForm;
//# sourceMappingURL=supplier.js.map