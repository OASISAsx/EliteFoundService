"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusByAdmin = exports.update = exports.findOne = exports.createUsersInformation = exports.create = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const create = async (req, res) => {
    try {
        const body = req.body;
        const usersInformation = await client_1.default.usersInformation.create({
            data: body,
        });
        res.status(201).json({
            success: true,
            data: usersInformation,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to user",
        });
    }
};
exports.create = create;
const createUsersInformation = async (req, res) => {
    const { userId, ...body } = req.body;
    try {
        const { citizenId, phone } = body;
        const exists = await client_1.default.usersInformation.findFirst({
            where: {
                OR: [{ citizenId }, { phone }].filter(Boolean),
            },
        });
        if (exists) {
            return res.status(200).json({
                success: false,
                message: "ข้อมูลถูกใช้ไปแล้ว",
            });
        }
        const data = { ...body };
        if (!citizenId)
            delete data.citizenId;
        if (!phone)
            delete data.phone;
        const info = await client_1.default.usersInformation.create({
            data,
        });
        await client_1.default.users.update({
            where: { id: userId },
            data: {
                usersInformationId: info.id,
            },
        });
        res.status(201).json({ success: true, data: info });
    }
    catch (error) {
        console.error("CREATE USER INFO ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create user information",
        });
    }
};
exports.createUsersInformation = createUsersInformation;
const findOne = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }
        const user = await client_1.default.users.findFirst({
            where: { id: id },
            include: {
                usersInformation: {
                    include: {
                        bankInformation: true,
                    },
                },
            },
        });
        if (!user || !user.usersInformation) {
            return res.status(404).json({
                success: false,
                message: "User information not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user.usersInformation,
        });
    }
    catch (error) {
        console.error("GET USER INFO ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user information",
        });
    }
};
exports.findOne = findOne;
const update = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id is required",
            });
        }
        const { id: _, provinceCode, districtCode, subdistrictCode, createdAt, updatedAt, bankInformation, ...rest } = req.body;
        const updateData = await client_1.default.usersInformation.update({
            where: { id },
            data: {
                ...rest,
                province: provinceCode
                    ? { connect: { code: provinceCode } }
                    : { disconnect: true },
                district: districtCode
                    ? { connect: { code: districtCode } }
                    : { disconnect: true },
                subdistrict: subdistrictCode
                    ? { connect: { code: subdistrictCode } }
                    : { disconnect: true },
                ...(bankInformation && {
                    bankInformation: {
                        upsert: {
                            where: {
                                usersInformationId: id, // 🔥 สำคัญมาก
                            },
                            create: {
                                ...bankInformation,
                                usersInformationId: id,
                            },
                            update: bankInformation,
                        },
                    },
                }),
            },
            include: {
                bankInformation: true,
                province: true,
                district: true,
                subdistrict: true,
            },
        });
        res.status(200).json({
            success: true,
            data: updateData,
        });
    }
    catch (error) {
        console.error("UPDATE USER INFO ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user information",
        });
    }
};
exports.update = update;
const updateStatusByAdmin = async (req, res) => {
    const { id, status } = req.body;
    try {
        const result = await client_1.default.$transaction(async (tx) => {
            const loan = await tx.usersInformation.update({
                where: { id: id },
                data: {
                    status,
                },
            });
            if (!loan) {
                throw new Error("Loan contract not found");
            }
            // if (status !== "APPROVED") {
            //   return await tx.usersInformation.update({
            //     where: { id: usersInformationId },
            //     data: { status },
            //   });
            // }
        });
        res.status(200).json({
            success: true,
            message: "update Status User",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.updateStatusByAdmin = updateStatusByAdmin;
