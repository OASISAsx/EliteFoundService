export const ALL_LOAN_STATUS = [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
] as const;

export type LoanStatus = (typeof ALL_LOAN_STATUS)[number];
