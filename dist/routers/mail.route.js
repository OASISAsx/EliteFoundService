"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/mail.route.ts
const express_1 = __importDefault(require("express"));
const mail_controller_1 = require("../controllers/mail.controller");
const router = express_1.default.Router();
router.post("/send-email", mail_controller_1.sendEmail);
exports.default = router;
