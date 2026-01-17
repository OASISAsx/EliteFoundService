import prisma from "../prisma/client";
import { Request, Response } from "express";
const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { id: _, ...rest } = req.body;
    
    const updateData = await prisma.jobDetail.update({
      where: { id },
      data: rest,
    });
    res.status(200).json({ success: true, data: updateData });
  } catch (error) {
    console.error("UPDATE USER INFO ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user information",
    });
  }
};

export { update };
