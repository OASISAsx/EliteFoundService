"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routers/index"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
// เพิ่มตรงส่วนบนของไฟล์
// Prisma singleton (สำคัญมากสำหรับ Vercel serverless)
const prisma = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
// ... โค้ดเดิมของคุณต่อ
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// health check
app.get("/", (_req, res) => {
    res.status(200).send("🚀 Backend is running");
});
// register routes
index_1.default.forEach(({ path, router }) => {
    app.use(path, router);
});
exports.default = app;
