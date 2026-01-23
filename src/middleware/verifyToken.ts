// src/middleware/verifyToken.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { CustomRequest } from "../types/request.type";

interface JwtPayload {
  id: string;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const roles = user.userRoles.map(
      (ur) => ur.role.name, // "ADMIN"
    );

    req.auth = {
      userId: user.id,
      roles,
    };

    req.user = {
      id: user.id,
      email: user.email ?? undefined,
    };

    console.log("✅ verifyToken auth:", req.auth);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
