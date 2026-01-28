"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
// src/services/mail.service.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendMail = async ({ to, subject, html, }) => {
    return exports.transporter.sendMail({
        from: `"Elite Fund" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
