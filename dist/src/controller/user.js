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
exports.login = exports.register = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAccesstoken_1 = require("../utils/getAccesstoken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { email, password } = body;
    try {
        const item = yield UserModel_1.default.findOne({ email });
        if (item) {
            throw new Error('Email này đã tồn tại!!!');
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPasword = yield bcrypt_1.default.hash(password, salt);
        body.password = hashPasword;
        const user = new UserModel_1.default(body);
        yield user.save();
        delete user._doc.password;
        const accesstoken = yield (0, getAccesstoken_1.getAccesstoken)({ _id: user._id, email: email, rule: user.rule });
        res.status(200).json({
            message: 'Đăng ký tài khoản thành công.',
            data: Object.assign(Object.assign({}, user._doc), { accesstoken })
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { email, password } = body;
    try {
        const item = yield UserModel_1.default.findOne({ email });
        if (!item) {
            throw new Error('Tài khoản không tồn tại!!!');
        }
        console.log(password);
        const isMatchPassword = yield bcrypt_1.default.compare(password, item.password);
        if (!isMatchPassword) {
            throw new Error('Sai Tài khoản hoặc mật khẩu!!!');
        }
        const accesstoken = yield (0, getAccesstoken_1.getAccesstoken)({ _id: item._id, email: item.email, rule: item.rule });
        res.status(200).json({
            message: 'Đăng nhập thành công',
            data: Object.assign(Object.assign({}, item._doc), { accesstoken })
        });
    }
    catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
});
exports.login = login;
//# sourceMappingURL=user.js.map