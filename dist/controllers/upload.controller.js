"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiUpload = exports.singleUpload = void 0;
const upload_service_1 = require("../services/upload.service");
const singleUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.log("REQ FILE =>", req.file);
            console.log("REQ BODY =>", req.body);
            return res.status(400).json({ message: "No file" });
        }
        const upload = await (0, upload_service_1.uploadToCloudinary)(file.buffer);
        const saved = await (0, upload_service_1.saveFile)(upload.secure_url);
        return res.json(saved);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
exports.singleUpload = singleUpload;
const multiUpload = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files" });
        }
        const results = await Promise.all(files.map(async (file) => {
            const upload = await (0, upload_service_1.uploadToCloudinary)(file.buffer);
            const saved = await (0, upload_service_1.saveFile)(upload.secure_url);
            return {
                id: saved.id,
                url: upload.secure_url,
            };
        }));
        return res.json({
            success: true,
            data: results,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
exports.multiUpload = multiUpload;
