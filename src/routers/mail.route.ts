// src/routes/mail.route.ts
import express from "express";
import { sendEmail } from "../controllers/mail.controller";

const router = express.Router();

router.post("/send-email", sendEmail);

export default router;
