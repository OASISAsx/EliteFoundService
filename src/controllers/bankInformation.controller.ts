import prisma from "../prisma/client";
import { Request, Response } from "express";

const findOne = async (req: Request, res: Response) => {
  try {
    const { usersInformationId } = req.params;
    const BankUser = await prisma.bankInformation.findFirst({
      where: { usersInformationId },
      include: {
        usersInformation: true,
      },
    });
    res.status(200).json({ success: true, data: BankUser });
  } catch (error) {
    console.error("JOB DETAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save job detail",
      error,
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { ...body } = req.body;

    const create = await prisma.bankInformation.create({
      data: {
        ...body,
        monthlyIncome: Number(body.monthlyIncome),
        monthlyExpense: body.monthlyExpense ? Number(body.monthlyExpense) : 0,
        balanceEstimate: Number(body.balanceEstimate),
        debtInstallmentPerMonth: Number(body.debtInstallmentPerMonth),
      },
    });
    console.log(create);
    res.status(200).json({ success: true, data: create });
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

    const updateData = await prisma.bankInformation.update({
      where: { id },
      data: {
        ...rest,
        monthlyIncome: Number(rest.monthlyIncome),
        monthlyExpense: rest.monthlyExpense ? Number(rest.monthlyExpense) : 0,
        balanceEstimate: Number(rest.balanceEstimate),
        debtInstallmentPerMonth: Number(rest.debtInstallmentPerMonth),
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

export { create, update, findOne };
