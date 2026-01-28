"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subdistrict = exports.district = exports.provices = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const provices = async (req, res) => {
    try {
        const data = await client_1.default.province.findMany({
            orderBy: { nameTh: "asc" },
        });
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to provices",
        });
        success: false;
    }
};
exports.provices = provices;
const district = async (req, res) => {
    try {
        const provinceCode = Number(req.query.provinceCode);
        if (!provinceCode) {
            return res.status(400).json({
                success: false,
                message: "provinceCode is required",
            });
        }
        const data = await client_1.default.district.findMany({
            where: { provinceCode },
            orderBy: { nameTh: "asc" },
        });
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "cannot fetch data",
        });
    }
};
exports.district = district;
const subdistrict = async (req, res) => {
    try {
        const districtCode = Number(req.query.districtCode);
        if (!districtCode) {
            return res.status(400).json({
                success: false,
                message: "districtCode is required",
            });
        }
        const data = await client_1.default.subdistrict.findMany({
            where: { districtCode },
            orderBy: { nameTh: "asc" },
        });
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "cannot fetch data",
        });
    }
};
exports.subdistrict = subdistrict;
