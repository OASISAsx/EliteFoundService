import { Request, Response } from "express";
import prisma from "../prisma/client";

const create = async (req: Request, res: Response) => {
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

const createUsersInformation = async (req: Request, res: Response) => {
  const { userId, ...body } = req.body;

  try {
    if (body.date_of_birth && body.date_of_birth !== "") {
      body.date_of_birth = new Date(body.date_of_birth);
    } else {
      delete body.date_of_birth;
    }

    const info = await prisma.usersInformation.create({
      data: body,
    });

    await prisma.users.update({
      where: { id: userId },
      data: {
        usersInformationId: info.id,
      },
    });

    res.status(201).json({ success: true, data: info });
  } catch (error) {
    console.error("CREATE USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user information",
    });
  }
};

export { create, createUsersInformation };
