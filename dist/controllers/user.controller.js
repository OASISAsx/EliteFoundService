"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.getUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUsers = async (_req, res) => {
    try {
        const users = await client_1.default.users.findMany({});
        res.status(200).json({
            success: true,
            // count: users.length,
            data: users,
        });
    }
    catch (error) {
        console.error("getUsers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getUsers = getUsers;
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = await client_1.default.users.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json({
            success: true,
            data: newUser,
        });
    }
    catch (error) {
        console.error("register error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client_1.default.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            success: true,
            data: { user, token },
        });
    }
    catch (error) {
        console.error("login error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
};
exports.login = login;
