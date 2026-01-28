"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPayload = void 0;
// src/middleware/decryptPayload.ts
const crypto_js_1 = __importDefault(require("crypto-js"));
// src/middleware/decryptPayload.ts
const decryptPayload = (req, res, next) => {
    try {
        const { payload } = req.body;
        if (!payload) {
            return res.status(400).json({ message: "Payload required" });
        }
        if (!req.roleSecret) {
            return res.status(403).json({ message: "Role secret missing" });
        }
        const bytes = crypto_js_1.default.AES.decrypt(payload, req.roleSecret);
        const decrypted = bytes.toString(crypto_js_1.default.enc.Utf8);
        if (!decrypted) {
            return res.status(400).json({ message: "Invalid payload" });
        }
        const parsed = JSON.parse(decrypted);
        req.decryptedBody = parsed; // ⭐ จุดสำคัญที่สุด
        console.log("🔓 decryptedBody:", parsed);
        next();
    }
    catch (err) {
        console.error("decryptPayload error:", err);
        return res.status(400).json({ message: "Decrypt failed" });
    }
};
exports.decryptPayload = decryptPayload;
