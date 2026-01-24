import prisma from "../prisma/client";

const generateLoanNo = async () => {
  const year = new Date().getFullYear();

  const startOfYear = new Date(year, 0, 1);
  const startOfNextYear = new Date(year + 1, 0, 1);

  const count = await prisma.loanContract.count({
    where: {
      createdAt: {
        gte: startOfYear,
        lt: startOfNextYear,
      },
    },
  });

  return `LN-${year}-${String(count + 1).padStart(3, "0")}`;
};

export { generateLoanNo };
