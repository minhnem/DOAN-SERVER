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
exports.getDishByIdCategories = exports.getAllCategoriesPerent = exports.filterProduct = exports.getAllProduct = exports.getProductDetail = exports.updateProduct = exports.deleteProduct = exports.addProduct = exports.getProducts = exports.updateCategory = exports.deleteCategories = exports.getCategoryDetail = exports.getAllCategories = exports.getCategories = exports.addCategory = void 0;
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const DishModel_1 = __importDefault(require("../models/DishModel"));
const cloudinary_1 = require("../utils/cloudinary");
// Dish
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, page, pageSize } = req.query;
    const filter = {};
    if (title) {
        filter.slug = { $regex: title };
    }
    filter.isDeleted = false;
    try {
        const skip = (page - 1) * pageSize;
        const products = yield DishModel_1.default.find(filter).skip(skip).limit(pageSize).lean();
        const totalProduct = yield DishModel_1.default.find({ isDeleted: false });
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
exports.getProducts = getProducts;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield DishModel_1.default.find({});
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
exports.getAllProduct = getAllProduct;
const getProductDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const product = yield DishModel_1.default.findById(id);
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
exports.getProductDetail = getProductDetail;
const getDishByIdCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const product = yield DishModel_1.default.find({ categories: { $in: [id] } });
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
exports.getDishByIdCategories = getDishByIdCategories;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const item = yield DishModel_1.default.findOne({ slug: body.slug });
        if (item) {
            throw new Error('Món ăn này đã tồn tại.');
        }
        const newProduct = new DishModel_1.default(body);
        yield newProduct.save();
        res.status(200).json({
            message: 'Thêm món ăn thành công',
            data: newProduct
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.addProduct = addProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const item = yield DishModel_1.default.findById(id);
        if (item && item.images.length > 0) {
            for (const i of item.images) {
                yield (0, cloudinary_1.deleteFileByUrl)(i);
            }
        }
        yield DishModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        res.status(200).json({
            message: 'Xóa món ăn thành công.',
            data: []
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.deleteProduct = deleteProduct;
const findEndDeleteUrl = (arr1, arr2) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(arr1)) {
        for (const i of arr2) {
            yield (0, cloudinary_1.deleteFileByUrl)(i);
        }
    }
    else {
        const itemDelete = arr2.filter((item) => !arr1.includes(item));
        if (itemDelete.length > 0) {
            for (const i of itemDelete) {
                yield (0, cloudinary_1.deleteFileByUrl)(i);
            }
        }
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        const item = yield DishModel_1.default.findById(id);
        item && findEndDeleteUrl(body.images, item.images);
        const product = yield DishModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).json({
            message: 'Sửa món ăn thành công.',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.updateProduct = updateProduct;
const filterProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { categories, price } = body;
    try {
        const filter = {};
        if (categories && categories.length > 0) {
            filter.categories = { $in: categories };
        }
        if (price && price.length > 0) {
            filter.price = { $gte: price[0], $lte: price[1] };
        }
        const product = yield DishModel_1.default.find(filter);
        res.status(200).json({
            message: 'Sửa món ăn thành công.',
            data: product
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.filterProduct = filterProduct;
// Category
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { parentId, slug } = body;
    try {
        const category = yield CategoryModel_1.default.findOne({
            parentId: parentId,
            slug: slug
        });
        if (category) {
            throw Error('Danh mục đã tồn tại.');
        }
        const newCategory = new CategoryModel_1.default(body);
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
exports.addCategory = addCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    try {
        const skip = (page - 1) * pageSize;
        const categories = yield CategoryModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] }).skip(skip).limit(pageSize);
        const total = yield CategoryModel_1.default.countDocuments();
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
exports.getCategories = getCategories;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryModel_1.default.find({ $or: [{ isDeleted: false }, { isDeleted: null }] });
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
exports.getAllCategories = getAllCategories;
const getAllCategoriesPerent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield CategoryModel_1.default.find({ parentId: '', $or: [{ isDeleted: false }, { isDeleted: null }] });
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
exports.getAllCategoriesPerent = getAllCategoriesPerent;
const getCategoryDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const category = yield CategoryModel_1.default.findById(id);
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
exports.getCategoryDetail = getCategoryDetail;
const findAndDeleteCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield CategoryModel_1.default.find({ parentId: id });
    if (categories.length > 0) {
        categories.forEach((item) => __awaiter(void 0, void 0, void 0, function* () { return yield findAndDeleteCategoryInProduct(item._id); }));
    }
    yield handleRemoveCategoryInProduct(id);
});
const handleRemoveCategoryInProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield DishModel_1.default.find({ categories: { $all: id } });
    if (products && products.length > 0) {
        products.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
            const cats = element._doc.categories;
            const index = cats.findIndex((item) => item === id);
            if (index !== -1) {
                cats.splice(index, 1);
            }
            yield DishModel_1.default.findByIdAndUpdate(element._id, { categories: cats });
        }));
    }
});
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, isDeleted } = req.query;
    try {
        yield findAndDeleteCategoryInProduct(id);
        if (isDeleted) {
            yield CategoryModel_1.default.updateMany({ parentId: id }, { $set: { parentId: '' } });
            yield CategoryModel_1.default.findByIdAndUpdate(id, { isDeleted: true });
        }
        else {
            yield CategoryModel_1.default.updateMany({ parentId: id }, { $set: { parentId: '' } });
            yield CategoryModel_1.default.findByIdAndDelete(id);
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
exports.deleteCategories = deleteCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.query;
    try {
        yield CategoryModel_1.default.findByIdAndUpdate(id, body);
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
exports.updateCategory = updateCategory;
//# sourceMappingURL=dishes.js.map