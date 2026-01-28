import express from "express";
import cors from "cors";
import routes from "./routers/index";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const app = express();
// เพิ่มตรงส่วนบนของไฟล์

// Prisma singleton (สำคัญมากสำหรับ Vercel serverless)
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// ... โค้ดเดิมของคุณต่อ
// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (_req, res) => {
  res.status(200).send("🚀 Backend is running");
});

// register routes
routes.forEach(({ path, router }) => {
  app.use(path, router);
});

export default app;
