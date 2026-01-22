// services/loanApplication.service.ts
import prisma from "../prisma/client";
import {
  updateAdminApprove,
  updateStatus,
} from "../services/statusMain.service";
import { calculateSchedule } from "../utils/calculateSchedule";
import { Request, Response } from "express";

const createLoanContact = async (req: Request, res: Response) => {
  try {
    const body = await req.body;

    const {
      loanAmount,
      interestRate,
      termMonths,
      loanType,
      startDate,
      usersInformationId,
    } = body;
    const amount = Number(loanAmount);
    const rate = Number(interestRate);
    const months = Number(termMonths);

    const schedule = calculateSchedule(amount, rate, months, startDate);

    const installmentPerMonth = schedule[0].total;
    const result = await prisma.$transaction(async (tx) => {
      // 1. create contract
      const loan = await tx.loanContract.create({
        data: {
          loanAmount: amount,
          interestRate: rate,
          termMonths: months,
          loanType,
          installmentPerMonth,
          status: "pending",
          startDate: new Date(startDate),
          usersInformationId,
        },
      });

      // 2. create repayments
      // await tx.loanRepayment.createMany({
      //   data: schedule.map((s) => ({
      //     loanContractId: loan.id,
      //     installmentNo: s.installmentNo,
      //     dueDate: s.dueDate,
      //     dueMonth: s.dueMonth,
      //     principal: s.principal,
      //     interest: s.interest,
      //     total: s.total,
      //     balance: s.balance,
      //   })),
      // });

      return loan;
    });
    await updateStatus(usersInformationId, loanAmount);
    return res.json({
      success: true,
      message: "Loan contract & repayments created",
      data: result,
    });
  } catch (err: any) {
    return Response.json(
      { success: false, message: err.message },
      { status: 400 },
    );
  }
};

const updateStatusByAdmin = async (req: Request, res: Response) => {
  const { loanContractId, status } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.loanContract.findUnique({
        where: { id: loanContractId },
      });

      if (!loan) {
        throw new Error("Loan contract not found");
      }

      if (status !== "approve") {
        return await tx.loanContract.update({
          where: { id: loanContractId },
          data: { status },
        });
      }

      //  approve case → calculate schedule
      const schedule = calculateSchedule(
        loan.loanAmount,
        loan.interestRate,
        loan.termMonths,
        loan.startDate,
      );

      const installmentPerMonth = schedule[0].total;

      const updatedLoan = await tx.loanContract.update({
        where: { id: loanContractId },
        data: {
          status: "approve",
          installmentPerMonth,
        },
      });

      // 5. create repayments
      await tx.loanRepayment.createMany({
        data: schedule.map((s) => ({
          loanContractId: loan.id,
          installmentNo: s.installmentNo,
          dueDate: s.dueDate,
          dueMonth: s.dueMonth,
          principal: s.principal,
          interest: s.interest,
          total: s.total,
          balance: s.balance,
        })),
      });
      await updateAdminApprove(updatedLoan);
      return updatedLoan;
    });

    return res.status(200).json({
      success: true,
      message: "Loan status updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const findOneContactLoan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const contracts = await prisma.loanContract.findMany({
      where: {
        usersInformationId: id,
      },
      select: {
        id: true,
        loanAmount: true,
        interestRate: true,
        termMonths: true,
        installmentPerMonth: true,
        loanType: true,
        status: true,
        startDate: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: contracts, // ✅ array แบน 100%
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch loan contracts",
    });
  }
};

const findAllUserContactLoan = async (req: Request, res: Response) => {
  try {
    const findData = await prisma.loanContract.findMany({
      include: {
        repayments: true,
      },
    });
    res.status(200).json({
      success: true,
      data: findData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

export {
  createLoanContact,
  findOneContactLoan,
  updateStatusByAdmin,
  findAllUserContactLoan,
};
