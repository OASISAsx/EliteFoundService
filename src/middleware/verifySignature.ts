// src/middleware/verifySignature.ts
import { Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../prisma/client";
import { CustomRequest } from "../types/request.type";

export const verifySignature = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const timestamp = req.headers["x-timestamp"] as string;
    const signature = req.headers["x-signature"] as string;
    const payload = req.body?.payload;

    if (!timestamp || !signature || !payload) {
      return res.status(401).json({ message: "Missing signature or payload" });
    }

    if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
      return res.status(401).json({ message: "Request expired" });
    }

    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const user = await prisma.users.findUnique({
      where: { id: req.auth.userId },
      include: {
        userRoles: { include: { role: true } },
      },
    });

    const matchedRole = user?.userRoles.find((ur) =>
      req.auth!.roles.includes(ur.role.name),
    );

    const roleSecret = matchedRole?.role.apiSecret;
    if (!roleSecret) {
      return res.status(403).json({ message: "Role secret not found" });
    }

    const payloadString =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    const expectedSignature = crypto
      .createHmac("sha256", roleSecret)
      .update(payloadString + timestamp)
      .digest("hex");

    console.log("BE payloadString:", payloadString);
    console.log("BE timestamp:", timestamp);
    console.log("BE sign input:", payloadString + timestamp);
    console.log("BE expectedSignature:", expectedSignature);
    console.log("FE signature:", signature);

    if (expectedSignature !== signature) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    req.roleSecret = roleSecret;
    return next();
  } catch (error) {
    console.error("verifySignature error:", error);
    return res.status(500).json({ message: "Signature verification failed" });
  }
};
