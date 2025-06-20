"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const headers = req.headers.authorization;
    const accesstoken = headers ? headers.split(" ")[1] : "";
    try {
        if (!accesstoken) {
            throw new Error("Không có quyền truy cập");
        }
        const decoded = jsonwebtoken_1.default.verify(accesstoken, process.env.SECRET_KEY);
        if (!decoded) {
            throw new Error("Token không hợp lệ");
        }
        req._id = decoded._id;
        req.rule = decoded.rule;
        next();
    }
    catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map