"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminReject = exports.updateAdminApprove = exports.updateStatus = exports.createMainStatus = exports.MainStatus = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createMainStatus = async (usersInformationId) => {
    await client_1.default.mainStatus.create({
        data: {
            usersInformationId,
            totalContracts: 0,
            pendingAmount: 0,
            approvedContracts: 0,
            approvedAmount: 0,
            usedAmount: 0,
            approvalRate: 0,
        },
    });
};
exports.createMainStatus = createMainStatus;
const MainStatus = async (req, res) => {
    try {
        const { usersInformationId } = req.params;
        const findOne = await client_1.default.mainStatus.findFirst({
            where: { usersInformationId },
        });
        res.status(200).json({ success: true, data: findOne });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to save job detail",
            error,
        });
    }
};
exports.MainStatus = MainStatus;
const updateStatus = async (usersInformationId, loanAmount) => {
    await client_1.default.mainStatus.update({
        where: { usersInformationId },
        data: {
            totalContracts: { increment: 1 },
            pendingAmount: { increment: loanAmount },
        },
    });
};
exports.updateStatus = updateStatus;
const updateAdminApprove = async (loan) => {
    await client_1.default.mainStatus.update({
        where: { usersInformationId: loan.usersInformationId },
        data: {
            pendingAmount: { decrement: loan.loanAmount },
            approvedContracts: { increment: 1 },
            approvedAmount: { increment: loan.loanAmount },
        },
    });
};
exports.updateAdminApprove = updateAdminApprove;
const updateAdminReject = async (loan) => {
    await client_1.default.mainStatus.update({
        where: { usersInformationId: loan.usersInformationId },
        data: {
            pendingAmount: { decrement: loan.loanAmount },
            approvedContracts: { increment: 1 },
            approvedAmount: { increment: loan.loanAmount },
        },
    });
};
exports.updateAdminReject = updateAdminReject;
