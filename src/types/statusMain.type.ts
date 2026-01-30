export interface StatusMain {
  id?: string;

  usersInformationId?: string;

  totalContracts?: number; // จำนวนสัญญา
  pendingAmount?: number; // จำนวนเงินที่รออนุมัติ
  approvedContracts?: number; // จำนวนสัญญาที่อนุมัติ
  approvedAmount?: number; // วงเงินที่อนุมัติแล้ว
  usedAmount?: number; // เงินที่ใช้ไปแล้ว
  loanAmount?: number;
  approvalRate?: number; // % การอนุมัติ

  lastUpdatedAt?: string; // ISO date
}
