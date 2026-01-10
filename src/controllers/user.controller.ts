import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({});

    res.status(200).json({
      success: true,
      // count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error("register error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

export { getUsers, register, login };
