"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token" });
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await client_1.default.users.findUnique({
            where: { id: decoded.id },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const roles = user.userRoles.map((ur) => ur.role.name);
        req.auth = {
            userId: user.id,
            roles,
        };
        req.user = {
            id: user.id,
            email: user.email ?? undefined,
        };
        console.log("✅ verifyToken auth:", req.auth);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
