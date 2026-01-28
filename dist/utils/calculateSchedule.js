"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSchedule = calculateSchedule;
function calculateSchedule(loanAmount, interestRate, months, startDate) {
    const r = interestRate / 12 / 100;
    const emi = r === 0
        ? loanAmount / months
        : (loanAmount * r * Math.pow(1 + r, months)) /
            (Math.pow(1 + r, months) - 1);
    let balance = loanAmount;
    const result = [];
    for (let i = 1; i <= months; i++) {
        const interest = balance * r;
        const principal = emi - interest;
        balance -= principal;
        const due = new Date(startDate);
        due.setMonth(due.getMonth() + i);
        result.push({
            installmentNo: i,
            principal: Number(principal.toFixed(2)),
            interest: Number(interest.toFixed(2)),
            total: Number(emi.toFixed(2)),
            balance: Number(balance > 0 ? balance.toFixed(2) : 0),
            dueDate: due,
            dueMonth: due.toISOString().slice(0, 7),
        });
    }
    return result;
}
