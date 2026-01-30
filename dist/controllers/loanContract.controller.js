"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersLoan = exports.findAllUserContactLoan = exports.updateStatusByAdmin = exports.findOneContactLoan = exports.createLoanContact = void 0;
// services/loanApplication.service.ts
const client_1 = __importDefault(require("../prisma/client"));
const statusMain_service_1 = require("../services/statusMain.service");
const calculateSchedule_1 = require("../utils/calculateSchedule");
const paginationZod_helper_1 = require("../helpers/paginationZod.helper");
const zod_1 = require("zod");
const pagination_schema_1 = require("../schemas/pagination.schema");
const statusDefault_1 = require("../constants/statusDefault");
const RunningNumberLoanContact_1 = require("../services/RunningNumberLoanContact");
const pagination_helper_1 = require("../helpers/pagination.helper");
const getUsersLoan = async (req, res) => {
    try {
        const parsed = pagination_schema_1.paginationSchema.parse(req.decryptedBody ?? req.query);
        console.log("✅ PARSED PAGINATION:", parsed);
        const { page: safePage, limit, take, skip } = (0, paginationZod_helper_1.getPagination)(parsed);
        console.log("🔍 decryptedBody =", req.decryptedBody);
        console.log("🧮 PAGINATION CALC:", {
            inputPage: parsed.page,
            safePage,
            take,
            skip,
        });
        const where = {};
        const [data, total] = await Promise.all([
            client_1.default.loanContract.findMany({
                where,
                include: {
                    usersInformation: {
                        include: {
                            bankInformation: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take,
                skip,
            }),
            client_1.default.loanContract.count({
                where,
            }),
        ]);
        const statusGroup = await client_1.default.loanContract.groupBy({
            where,
            by: ["status"],
            _count: { status: true },
        });
        const statusSummary = statusDefault_1.ALL_LOAN_STATUS.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});
        statusGroup.forEach((item) => {
            statusSummary[item.status] = item._count.status;
        });
        res.status(200).json({
            success: true,
            data,
            meta: (0, pagination_helper_1.buildPaginationMeta)(total, safePage, limit),
            status: statusSummary,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters",
            });
        }
        console.error("getUsersLoan error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Loan",
        });
    }
};
exports.getUsersLoan = getUsersLoan;
const createLoanContact = async (req, res) => {
    try {
        const body = await req.body;
        const { loanAmount, interestRate, termMonths, loanType, startDate, usersInformationId, } = body;
        const amount = Number(loanAmount);
        const rate = Number(interestRate);
        const months = Number(termMonths);
        const schedule = (0, calculateSchedule_1.calculateSchedule)(amount, rate, months, startDate);
        const loanNo = await (0, RunningNumberLoanContact_1.generateLoanNo)();
        const installmentPerMonth = schedule[0].total;
        const result = await client_1.default.$transaction(async (tx) => {
            // 1. create contract
            const loan = await tx.loanContract.create({
                data: {
                    loanNo,
                    loanAmount: amount,
                    interestRate: rate,
                    termMonths: months,
                    loanType,
                    installmentPerMonth,
                    status: "PENDING",
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
        await (0, statusMain_service_1.updateStatus)(usersInformationId, loanAmount);
        return res.json({
            success: true,
            message: "Loan contract & repayments created",
            data: result,
        });
    }
    catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 400 });
    }
};
exports.createLoanContact = createLoanContact;
const updateStatusByAdmin = async (req, res) => {
    const { loanContractId, status } = req.body;
    try {
        const result = await client_1.default.$transaction(async (tx) => {
            const loan = await tx.loanContract.findUnique({
                where: { id: loanContractId },
            });
            if (!loan) {
                throw new Error("Loan contract not found");
            }
            if (status !== "APPROVED") {
                return await tx.loanContract.update({
                    where: { id: loanContractId },
                    data: { status },
                });
            }
            //  approve case → calculate schedule
            const schedule = (0, calculateSchedule_1.calculateSchedule)(loan.loanAmount, loan.interestRate, loan.termMonths, loan.startDate);
            const installmentPerMonth = schedule[0].total;
            const updatedLoan = await tx.loanContract.update({
                where: { id: loanContractId },
                data: {
                    status: "APPROVED",
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
            await (0, statusMain_service_1.updateAdminApprove)(updatedLoan);
            return updatedLoan;
        });
        return res.status(200).json({
            success: true,
            message: "Loan status updated successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateStatusByAdmin = updateStatusByAdmin;
const findOneContactLoan = async (req, res) => {
    const { id } = req.params;
    try {
        const contracts = await client_1.default.loanContract.findMany({
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch loan contracts",
        });
    }
};
exports.findOneContactLoan = findOneContactLoan;
const findAllUserContactLoan = async (req, res) => {
    try {
        const findData = await client_1.default.loanContract.findMany({
            include: {
                repayments: true,
                usersInformation: true,
            },
        });
        res.status(200).json({
            success: true,
            data: findData,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err,
        });
    }
};
exports.findAllUserContactLoan = findAllUserContactLoan;
