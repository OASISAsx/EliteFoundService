"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = exports.update = exports.create = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const findOne = async (req, res) => {
    try {
        const { usersInformationId } = req.params;
        const BankUser = await client_1.default.bankInformation.findFirst({
            where: { usersInformationId },
            include: {
                usersInformation: true,
            },
        });
        res.status(200).json({ success: true, data: BankUser });
    }
    catch (error) {
        console.error("JOB DETAIL ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save job detail",
            error,
        });
    }
};
exports.findOne = findOne;
const create = async (req, res) => {
    try {
        const { ...body } = req.body;
        const create = await client_1.default.bankInformation.create({
            data: {
                ...body,
                monthlyIncome: Number(body.monthlyIncome),
                monthlyExpense: body.monthlyExpense ? Number(body.monthlyExpense) : 0,
                balanceEstimate: Number(body.balanceEstimate),
                debtInstallmentPerMonth: Number(body.debtInstallmentPerMonth),
            },
        });
        console.log(create);
        res.status(200).json({ success: true, data: create });
    }
    catch (error) {
        console.error("JOB DETAIL ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save job detail",
            error,
        });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: _, ...rest } = req.body;
        const updateData = await client_1.default.bankInformation.update({
            where: { id },
            data: {
                ...rest,
                monthlyIncome: Number(rest.monthlyIncome),
                monthlyExpense: rest.monthlyExpense ? Number(rest.monthlyExpense) : 0,
                balanceEstimate: Number(rest.balanceEstimate),
                debtInstallmentPerMonth: Number(rest.debtInstallmentPerMonth),
            },
        });
        res.status(200).json({ success: true, data: updateData });
    }
    catch (error) {
        console.error("UPDATE JOB DETAIL ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update job detail",
            error,
        });
    }
};
exports.update = update;
