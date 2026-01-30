export const ALL_LOAN_STATUS = [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
] as const;

export const ALL_USER_STATUS = ["PENDING", "APPROVED", "REJECTED"] as const;

export type LoanStatus = (typeof ALL_LOAN_STATUS)[number];

export type Status = (typeof ALL_USER_STATUS)[number];
