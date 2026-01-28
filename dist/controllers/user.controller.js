"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = exports.loginGoogle = exports.login = exports.register = exports.getUsers = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pagination_schema_1 = require("../schemas/pagination.schema");
const paginationZod_helper_1 = require("../helpers/paginationZod.helper");
const zod_1 = require("zod");
const roleUser_controller_1 = require("./roleUser.controller");
const pagination_helper_1 = require("../helpers/pagination.helper");
const statusDefault_1 = require("../constants/statusDefault");
const getUsers = async (req, res) => {
    try {
        // ✅ validate input (หลัง decrypt)
        const parsed = pagination_schema_1.paginationSchema.parse(req.decryptedBody ?? req.query);
        const { page: safePage, limit, take, skip } = (0, paginationZod_helper_1.getPagination)(parsed);
        const [data, total] = await Promise.all([
            client_1.default.users.findMany({
                where: {
                    usersInformation: {
                        isNot: null,
                    },
                },
                include: {
                    usersInformation: {
                        include: {
                            JobDetail: true,
                        },
                    },
                },
                take,
                skip,
            }),
            client_1.default.users.count({
                where: {
                    usersInformation: {
                        isNot: null,
                    },
                },
            }),
        ]);
        const statusGroup = await client_1.default.usersInformation.groupBy({
            // where: {
            //   isNot: null,
            // },
            by: ["status"],
            _count: { status: true },
        });
        const statusSummary = statusDefault_1.ALL_USER_STATUS.reduce((acc, status) => {
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
                // errors: error.errors,
            });
        }
        console.error("getUsers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.getUsers = getUsers;
const findOne = async (req, res) => {
    const isObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);
    try {
        const { id } = req.params;
        const where = isObjectId(id)
            ? { id } // Mongo ObjectId
            : { googleId: id }; // Google ID
        const user = await client_1.default.users.findFirst({
            where,
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                usersInformation: {
                    include: {
                        bankInformation: true,
                        JobDetail: true,
                        province: true,
                        district: true,
                        subdistrict: true,
                    },
                },
            },
        });
        const roles = user?.userRoles.map((ur) => ur.role.name);
        const { userRoles, ...userWithoutRoles } = user ?? {};
        let data = [userWithoutRoles, roles];
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("findOne error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};
exports.findOne = findOne;
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        // check email exists
        const existingUser = await client_1.default.users.findFirst({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const data = {
            name,
            email,
            password: hashedPassword,
            status: "active",
        };
        const googleId = data.googleId;
        data.googleId = googleId;
        console.log(googleId, "googleId");
        const newUser = await client_1.default.users.create({ data });
        (0, roleUser_controller_1.createUserLogin)(newUser.id);
        return res.status(201).json({
            success: true,
            data: newUser,
        });
    }
    catch (error) {
        console.error("register error:", error);
        return res.status(500).json({
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
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                usersInformation: {
                    include: {
                        JobDetail: true,
                        province: true,
                        district: true,
                        subdistrict: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password || "");
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        await client_1.default.sessions.upsert({
            where: {
                user_id: user.id,
            },
            update: {
                jwt: token,
            },
            create: {
                user_id: user.id,
                jwt: token,
            },
        });
        res.status(200).json({
            success: true,
            token,
            data: user,
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
const loginGoogle = async (req, res) => {
    const { googleId, email, name, image } = req.body;
    let user = await client_1.default.users.findFirst({
        where: {
            OR: [{ googleId }, { email }],
        },
        include: {
            userRoles: {
                include: {
                    role: true,
                },
            },
            usersInformation: {
                include: {
                    JobDetail: true,
                    province: true,
                    district: true,
                    subdistrict: true,
                },
            },
        },
    });
    if (!user) {
        user = await client_1.default.users.create({
            data: {
                googleId,
                email,
                name,
                profileImage: image,
                status: "active",
            },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                usersInformation: {
                    include: {
                        JobDetail: true,
                        province: true,
                        district: true,
                        subdistrict: true,
                    },
                },
            },
        });
        (0, roleUser_controller_1.createUserLogin)(user.id);
    }
    else if (!user.googleId) {
        user = await client_1.default.users.update({
            where: { id: user.id },
            data: { googleId },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                usersInformation: {
                    include: {
                        JobDetail: true,
                        province: true,
                        district: true,
                        subdistrict: true,
                    },
                },
            },
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    await client_1.default.sessions.upsert({
        where: {
            user_id: user.id,
        },
        update: {
            jwt: token,
        },
        create: {
            user_id: user.id,
            jwt: token,
        },
    });
    res.status(200).json({
        success: true,
        token,
        data: user,
    });
};
exports.loginGoogle = loginGoogle;
