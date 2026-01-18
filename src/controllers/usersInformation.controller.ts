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
    // if (body.date_of_birth && body.date_of_birth !== "") {
    //   body.date_of_birth = new Date(body.date_of_birth);
    // } else {
    //   delete body.date_of_birth;
    // }
    const { citizenId } = body;

    const exists = await prisma.usersInformation.findUnique({
      where: { citizenId },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "CitizenId already exists",
      });
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

const findOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userId = await prisma.usersInformation.findUnique({
      where: { id },
    });

    res.status(201).json({ success: true, data: userId });
  } catch (error) {
    console.error("CREATE USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user information",
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      id: _,
      provinceCode,
      districtCode,
      subdistrictCode,
      createdAt,
      updatedAt,
      ...rest
    } = req.body;

    const updateData = await prisma.usersInformation.update({
      where: { id },
      data: {
        ...rest,
        province: provinceCode
          ? { connect: { code: provinceCode } }
          : undefined,
        district: districtCode
          ? { connect: { code: districtCode } }
          : undefined,
        subdistrict: subdistrictCode
          ? { connect: { code: subdistrictCode } }
          : undefined,
      },
    });
    res.status(200).json({ success: true, data: updateData });
  } catch (error) {
    console.error("UPDATE USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user information",
    });
  }
};

export { create, createUsersInformation, findOne, update };
