import prisma from "../prisma/client";
import { Request, Response } from "express";
import { createMainStatus } from "../services/statusMain.service";

const create = async (req: Request, res: Response) => {
  try {
    const { usersInformationId, ...body } = req.body;

    const updateData = await prisma.jobDetail.upsert({
      where: {
        usersInformationId,
      },
      update: {
        ...body,
        salaryPerMonth: Number(body.salaryPerMonth),
        otherIncome: body.otherIncome ? Number(body.otherIncome) : 0,
        workYears: Number(body.workYears),
      },
      create: {
        ...body,
        salaryPerMonth: Number(body.salaryPerMonth),
        otherIncome: body.otherIncome ? Number(body.otherIncome) : 0,
        workYears: Number(body.workYears),
        usersInformationId,
      },
    });
    await createMainStatus(usersInformationId);
    res.status(200).json({ success: true, data: updateData });
  } catch (error) {
    console.error("JOB DETAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save job detail",
      error,
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { id: _, ...rest } = req.body;

    const updateData = await prisma.jobDetail.update({
      where: { id },
      data: {
        ...rest,
        salaryPerMonth: Number(rest.salaryPerMonth),
        otherIncome: rest.otherIncome ? Number(rest.otherIncome) : 0,
        workYears: Number(rest.workYears),
      },
    });

    res.status(200).json({ success: true, data: updateData });
  } catch (error) {
    console.error("UPDATE JOB DETAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job detail",
      error,
    });
  }
};

export { create, update };
