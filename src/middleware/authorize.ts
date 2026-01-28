// src/middleware/authorize.ts
import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/request.type";

export const authorize =
  (roles: string[] = []) =>
  (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 👇 บอก TS ว่าจุดนี้ auth มีค่าแน่นอน
    const auth = req.auth;

    if (roles.length === 0) {
      return next();
    }

    const userRoles = auth.roles.map((r) => r.toLowerCase());
    const requiredRoles = roles.map((r) => r.toLowerCase());

    const hasRole = userRoles.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
