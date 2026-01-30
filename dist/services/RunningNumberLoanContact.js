"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLoanNo = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const generateLoanNo = async () => {
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const count = await client_1.default.loanContract.count({
        where: {
            createdAt: {
                gte: startOfYear,
                lt: startOfNextYear,
            },
        },
    });
    return `LN-${year}-${String(count + 1).padStart(3, "0")}`;
};
exports.generateLoanNo = generateLoanNo;
