import { Request, Response } from "express";
import prisma from "../prisma/client";
import { error } from "node:console";

const createAbout = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const usersInformation = await prisma.usersInformation.create({
      data: body,
    });

    res.status(201).json({
      success: true,
      data: usersInformation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to user",
    });
  }
};

export { createAbout };
