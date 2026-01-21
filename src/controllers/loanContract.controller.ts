// services/loanApplication.service.ts
import prisma from "../prisma/client";
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
          status: "active",
          startDate: new Date(startDate),
          usersInformationId,
        },
      });

      // 2. create repayments
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

      return loan;
    });

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

const findOneContactLoan = async (req: Request, res: Response) => {
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

export { createLoanContact, findOneContactLoan };
