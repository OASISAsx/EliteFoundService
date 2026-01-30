import { Request, Response } from "express";
import prisma from "../prisma/client";
import { success } from "zod";

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
    const { citizenId, phone } = body;

    const exists = await prisma.usersInformation.findFirst({
      where: {
        OR: [{ citizenId }, { phone }].filter(Boolean),
      },
    });

    if (exists) {
      return res.status(200).json({
        success: false,
        message: "ข้อมูลถูกใช้ไปแล้ว",
      });
    }

    const data: any = { ...body };

    if (!citizenId) delete data.citizenId;
    if (!phone) delete data.phone;

    const info = await prisma.usersInformation.create({
      data,
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
              where: {
                usersInformationId: id, // 🔥 สำคัญมาก
              },
              create: {
                ...bankInformation,
                usersInformationId: id,
              },
              update: bankInformation,
            },
          },
        }),
      },
      include: {
        bankInformation: true,
        province: true,
        district: true,
        subdistrict: true,
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

const updateStatusByAdmin = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.usersInformation.update({
        where: { id: id },
        data: {
          status,
        },
      });

      if (!loan) {
        throw new Error("Loan contract not found");
      }

      // if (status !== "APPROVED") {
      //   return await tx.usersInformation.update({
      //     where: { id: usersInformationId },
      //     data: { status },
      //   });
      // }
    });

    res.status(200).json({
      success: true,
      message: "update Status User",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { create, createUsersInformation, findOne, update, updateStatusByAdmin };
