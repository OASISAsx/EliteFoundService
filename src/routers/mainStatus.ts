// src/routes/mail.route.ts
import express from "express";
import { MainStatus } from "../services/statusMain.service";

const router = express.Router();

router.get("/status/:id", MainStatus);

export default router;
