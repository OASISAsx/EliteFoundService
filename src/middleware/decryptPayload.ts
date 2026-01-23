// src/middleware/decryptPayload.ts
import CryptoJS from "crypto-js";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/request.type";

export const decryptPayload = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { payload } = req.body as { payload?: string };

    if (!payload) {
      return res.status(400).json({ message: "Payload required" });
    }

    if (!req.roleSecret) {
      return res.status(403).json({ message: "Role secret missing" });
    }

    const bytes = CryptoJS.AES.decrypt(payload, req.roleSecret);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    req.body = JSON.parse(decrypted);

    next();
  } catch (err) {
    console.error("decryptPayload error:", err);
    return res.status(400).json({ message: "Decrypt failed" });
  }
};
