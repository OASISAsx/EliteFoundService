import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getPagination,
  buildPaginationMeta,
} from "../helpers/pagination.helper";

const getUsers = async (_req: Request, res: Response) => {
  try {
    const { page, limit, take, skip } = getPagination(_req.query);

    const [data, total] = await Promise.all([
      prisma.users.findMany({
        include: {
          usersInformation: true,
        },
        take,
        skip,
      }),
      prisma.users.count(),
    ]);

    res.status(200).json({
      success: true,
      data: data,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const findOne = async (req: Request, res: Response) => {
  const isObjectId = (value: string) => /^[0-9a-fA-F]{24}$/.test(value);

  try {
    const { id } = req.params;

    const where = isObjectId(id)
      ? { id } // Mongo ObjectId
      : { googleId: id }; // Google ID

    const user = await prisma.users.findFirst({
      where,
      include: {
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("findOne error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // check email exists
    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data: any = {
      name,
      email,
      password: hashedPassword,
      status: "active",
    };
    const googleId = data.googleId;
    data.googleId = googleId;
    console.log(googleId, "googleId");
    const newUser = await prisma.users.create({ data });

    return res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error: any) {
    console.error("register error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register user",
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
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

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    await prisma.sessions.upsert({
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
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

const loginGoogle = async (req: Request, res: Response) => {
  const { googleId, email, name, image } = req.body;

  let user = await prisma.users.findFirst({
    where: {
      OR: [{ googleId }, { email }],
    },
    include: {
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
    user = await prisma.users.create({
      data: {
        googleId,
        email,
        name,
        profileImage: image,
        status: "active",
      },
      include: {
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
  } else if (!user.googleId) {
    user = await prisma.users.update({
      where: { id: user.id },
      data: { googleId },
      include: {
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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  await prisma.sessions.upsert({
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

export { getUsers, register, login, loginGoogle, findOne };
