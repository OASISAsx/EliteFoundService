import prisma from "../prisma/client";
import { StatusMain } from "../types/statusMain.type";
import { Request, Response } from "express";
const createMainStatus = async (usersInformationId: string) => {
  await prisma.mainStatus.create({
    data: {
      usersInformationId,
      totalContracts: 0,
      pendingAmount: 0,
      approvedContracts: 0,
      approvedAmount: 0,
      usedAmount: 0,
      approvalRate: 0,
    },
  });
};

const MainStatus = async (req: Request, res: Response) => {
  try {
    const { usersInformationId } = req.params;
    const findOne = await prisma.mainStatus.findFirst({
      where: { usersInformationId },
    });

    res.status(200).json({ success: true, data: findOne });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save job detail",
      error,
    });
  }
};

const updateStatus = async (usersInformationId: string, loanAmount: number) => {
  await prisma.mainStatus.update({
    where: { usersInformationId },
    data: {
      totalContracts: { increment: 1 },
      pendingAmount: { increment: loanAmount },
    },
  });
};

const updateAdminApprove = async (loan: StatusMain) => {
  await prisma.mainStatus.update({
    where: { usersInformationId: loan.usersInformationId },
    data: {
      pendingAmount: { decrement: loan.loanAmount },
      approvedContracts: { increment: 1 },
      approvedAmount: { increment: loan.loanAmount },
    },
  });
};

const updateAdminReject = async (loan: StatusMain) => {
  await prisma.mainStatus.update({
    where: { usersInformationId: loan.usersInformationId },
    data: {
      pendingAmount: { decrement: loan.loanAmount },
      approvedContracts: { increment: 1 },
      approvedAmount: { increment: loan.loanAmount },
    },
  });
};

export {
  MainStatus,
  createMainStatus,
  updateStatus,
  updateAdminApprove,
  updateAdminReject,
};
