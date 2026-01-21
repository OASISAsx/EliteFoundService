// services/loanApplication.service.ts
import prisma from "../prisma/client";
import { calculateSchedule } from "../utils/calculateSchedule";
import dayjs from "dayjs";

export const createLoanApplication = async (payload: any) => {
  const {
    loanAmount,
    interestRate,
    termMonths,
    loanType,
    startDate,
    usersInformationId,
  } = payload;

  // 1. calculate EMI
  const schedule = calculateSchedule(
    loanAmount,
    interestRate,
    termMonths,
    startDate,
  );

  const installmentPerMonth = schedule[0].total;

  // 2. create loanApplication
  const loan = await prisma.loanContract.create({
    data: {
      loanAmount,
      interestRate,
      termMonths,
      loanType,
      installmentPerMonth,
      status: "active",
      startDate: new Date(startDate),
      usersInformationId,
    },
  });

  // 3. map repayment schedule
  const repayments = schedule.map((s: any) => {
    const dueDate = dayjs(startDate).add(s.installmentNo, "month").toDate();

    return {
      installmentNo: s.installmentNo,
      dueDate,
      dueMonth: dayjs(dueDate).format("YYYY-MM"),
      principal: s.principal,
      interest: s.interest,
      total: s.total,
      balance: s.balance,
      status: "unpaid",
      loanContractId: loan.id,
    };
  });

  await prisma.loanRepayment.createMany({
    data: repayments,
  });

  return {
    loanApplication: loan,
    repayments,
  };
};
