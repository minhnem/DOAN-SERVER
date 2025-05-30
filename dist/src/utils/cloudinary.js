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
exports.deleteFileByUrl = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const deleteFileByUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlWithoutParams = url.split('?')[0];
        const uploadIndex = urlWithoutParams.indexOf('/upload/');
        if (uploadIndex === -1) {
            throw new Error('Không phải URL Cloudinary hợp lệ');
        }
        let fullPath = urlWithoutParams.slice(uploadIndex + 8);
        const versionMatch = fullPath.match(/^v\d+\//);
        if (versionMatch) {
            fullPath = fullPath.substring(versionMatch[0].length);
        }
        const publicId = fullPath.substring(0, fullPath.lastIndexOf('.'));
        const result = yield cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        console.error('Lỗi khi xóa ảnh từ Cloudinary:', error);
        throw error;
    }
});
exports.deleteFileByUrl = deleteFileByUrl;
//# sourceMappingURL=cloudinary.js.map