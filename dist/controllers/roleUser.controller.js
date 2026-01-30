"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserLogin = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createUserLogin = async (userId) => {
    try {
        const findRole = await client_1.default.role.findFirst({
            where: { name: "USER" },
        });
        if (!findRole) {
            throw new Error("USER role not found");
        }
        const createUser = await client_1.default.userRole.create({
            data: { userId, roleId: findRole.id },
        });
        return createUser;
    }
    catch (error) {
        console.error("createUserLogin error:", error);
        throw error;
    }
};
exports.createUserLogin = createUserLogin;
