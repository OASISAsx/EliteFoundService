"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const client_1 = __importDefault(require("../prisma/client"));
const uploadToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.uploader
            .upload_stream({ folder: "uploads" }, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        })
            .end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const saveFile = async (url) => {
    return client_1.default.fileUpload.create({
        data: { url },
    });
};
exports.saveFile = saveFile;
