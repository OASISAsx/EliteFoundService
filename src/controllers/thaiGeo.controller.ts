import { Request, Response } from "express";
import prisma from "../prisma/client";
import { json } from "node:stream/consumers";

const provices = async (req: Request, res: Response) => {
  try {
    const data = await prisma.province.findMany({
      orderBy: { nameTh: "asc" },
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to provices",
    });
    success: false;
  }
};

const district = async (req: Request, res: Response) => {
  try {
    const provinceCode = Number(req.query.provinceCode);

    if (!provinceCode) {
      return res.status(400).json({
        success: false,
        message: "provinceCode is required",
      });
    }

    const data = await prisma.district.findMany({
      where: { provinceCode },
      orderBy: { nameTh: "asc" },
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "cannot fetch data",
    });
  }
};

const subdistrict = async (req: Request, res: Response) => {
  try {
    const districtCode = Number(req.query.districtCode);

    if (!districtCode) {
      return res.status(400).json({
        success: false,
        message: "districtCode is required",
      });
    }

    const data = await prisma.subdistrict.findMany({
      where: { districtCode },
      orderBy: { nameTh: "asc" },
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "cannot fetch data",
    });
  }
};

export { provices, district, subdistrict };
