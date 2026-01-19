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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const user = await prisma.users.findFirst({
      where: { id: id },
      include: {
        usersInformation: {
          include: {
            bankInformation: true,
          },
        },
      },
    });

    if (!user || !user.usersInformation) {
      return res.status(404).json({
        success: false,
        message: "User information not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.usersInformation,
    });
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }

    const {
      id: _,
      provinceCode,
      districtCode,
      subdistrictCode,
      createdAt,
      updatedAt,
      bankInformation,
      ...rest
    } = req.body;

    const updateData = await prisma.usersInformation.update({
      where: { id },
      data: {
        ...rest,

        province: provinceCode
          ? { connect: { code: provinceCode } }
          : { disconnect: true },

        district: districtCode
          ? { connect: { code: districtCode } }
          : { disconnect: true },

        subdistrict: subdistrictCode
          ? { connect: { code: subdistrictCode } }
          : { disconnect: true },

        ...(bankInformation && {
          bankInformation: {
            upsert: {
              create: bankInformation,
              update: bankInformation,
            },
          },
        }),
      },
    });

    res.status(200).json({
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error("UPDATE USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user information",
    });
  }
};

export { create, createUsersInformation, findOne, update };
