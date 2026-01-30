"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const statusMain_service_1 = require("../services/statusMain.service");
const create = async (req, res) => {
    try {
        const { usersInformationId, ...body } = req.body;
        const updateData = await client_1.default.jobDetail.upsert({
            where: {
                usersInformationId,
            },
            update: {
                ...body,
                salaryPerMonth: Number(body.salaryPerMonth),
                otherIncome: body.otherIncome ? Number(body.otherIncome) : 0,
                workYears: Number(body.workYears),
            },
            create: {
                ...body,
                salaryPerMonth: Number(body.salaryPerMonth),
                otherIncome: body.otherIncome ? Number(body.otherIncome) : 0,
                workYears: Number(body.workYears),
                usersInformationId,
            },
        });
        await (0, statusMain_service_1.createMainStatus)(usersInformationId);
        res.status(200).json({ success: true, data: updateData });
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
        const updateData = await client_1.default.jobDetail.update({
            where: { id },
            data: {
                ...rest,
                salaryPerMonth: Number(rest.salaryPerMonth),
                otherIncome: rest.otherIncome ? Number(rest.otherIncome) : 0,
                workYears: Number(rest.workYears),
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
