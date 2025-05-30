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
exports.filterMaterials = exports.getAllMaterials = exports.getMaterialsDetail = exports.updateMaterials = exports.deleteMaterials = exports.addMaterials = exports.getMaterials = exports.updateCategoryMaterials = exports.deleteCategoriesMaterials = exports.getCategoryMaterialsDetail = exports.getAllCategoriesMaterials = exports.getCategoriesMaterials = exports.addCategoryMaterials = void 0;
const CategoryMaterialsModel_1 = __importDefault(require("../models/CategoryMaterialsModel"));
const MaterialsModel_1 = __importDefault(require("../models/MaterialsModel"));
// Materials
const getMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, page, pageSize } = req.query;
    const filter = {};
    if (title) {
        filter.slug = { $regex: title };
    }
    filter.isDeleted = false;
    try {
        const skip = (page - 1) * pageSize;
        const products = yield MaterialsModel_1.default.find(filter).skip(skip).limit(pageSize).lean();
        const totalProduct = yield MaterialsModel_1.default.find({ isDeleted: false });
        const total = totalProduct.length;
        res.status(200).json({
            message: 'Products',
            data: {
                products,
                total,
            },
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getMaterials = getMaterials;
const getAllMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield MaterialsModel_1.default.find({});
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllMaterials = getAllMaterials;
const getMaterialsDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const product = yield MaterialsModel_1.default.findById(id);
        res.status(200).json({
            message: 'Lấy sản phẩm theo id thành công',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getMaterialsDetail = getMaterialsDetail;
const addMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const item = yield MaterialsModel_1.default.findOne({ slug: body.slug });
        if (item) {
            throw new Error('Nguyên liệu này đã tồn tại.');
        }
        const newProduct = new MaterialsModel_1.default(body);
        yield newProduct.save();
        res.status(200).json({
            message: 'Thêm nguyên lệu thành công',
            data: newProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addMaterials = addMaterials;
const deleteMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        yield MaterialsModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json({
            message: 'Xóa nguyên liệu thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteMaterials = deleteMaterials;
const updateMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const product = yield MaterialsModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa nguyên liệu thành công.',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateMaterials = updateMaterials;
const filterMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { categories, price } = body;
    try {
        const filter = {};
        if (categories && categories.length > 0) {
            filter.categories = { $in: categories };
        }
        if (price && price.length > 0) {
            filter.price = { $gt: price[0], $lt: price[1] };
        }
        const product = yield MaterialsModel_1.default.find(filter);
        res.status(200).json({
            message: 'Sửa nguyên liệu thành công.',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.filterMaterials = filterMaterials;
// Category
const addCategoryMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { parentId, slug } = body;
    try {
        const category = yield CategoryMaterialsModel_1.default.findOne({
            parentId: parentId,
            slug: slug
        });
        if (category) {
            throw Error('Danh mục đã tồn tại.');
        }
        const newCategory = new CategoryMaterialsModel_1.default(body);
        yield newCategory.save();
        res.status(200).json({
            message: 'Thêm mới danh mục thành công.',
            data: newCategory
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addCategoryMaterials = addCategoryMaterials;
const getCategoriesMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    try {
        const skip = (page - 1) * pageSize;
        const categories = yield CategoryMaterialsModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] }).skip(skip).limit(pageSize);
        const total = yield CategoryMaterialsModel_1.default.countDocuments();
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: {
                categories,
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
exports.getCategoriesMaterials = getCategoriesMaterials;
const getAllCategoriesMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryMaterialsModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] });
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: categories,
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getAllCategoriesMaterials = getAllCategoriesMaterials;
const getCategoryMaterialsDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const category = yield CategoryMaterialsModel_1.default.findById(id);
        res.status(200).json({
            message: 'Lấy danh mục thành công.',
            data: category
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.getCategoryMaterialsDetail = getCategoryMaterialsDetail;
const findAndDeleteCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield CategoryMaterialsModel_1.default.find({ parentId: id });
    if (categories.length > 0) {
        categories.forEach((item) => __awaiter(void 0, void 0, void 0, function* () { return yield findAndDeleteCategoryInProduct(item._id); }));
    }
    yield handleRemoveCategoryInProduct(id);
});
const handleRemoveCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield MaterialsModel_1.default.find({ categories: { $all: id } });
    if (products && products.length > 0) {
        products.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            const cats = element._doc.categories;
            const index = cats.findIndex((item) => item === id);
            if (index !== -1) {
                cats.splice(index, 1);
            }
            yield MaterialsModel_1.default.findByIdAndUpdate(element._id, { categories: cats });
        }));
    }
});
const deleteCategoriesMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isDeleted } = req.query;
    try {
        yield findAndDeleteCategoryInProduct(id);
        if (isDeleted) {
            yield CategoryMaterialsModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        }
        else {
            yield CategoryMaterialsModel_1.default.findByIdAndDelete(id);
        }
        res.status(200).json({
            message: 'Xóa danh mục thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteCategoriesMaterials = deleteCategoriesMaterials;
const updateCategoryMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield CategoryMaterialsModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa danh mục thành công',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateCategoryMaterials = updateCategoryMaterials;
//# sourceMappingURL=materials.js.map