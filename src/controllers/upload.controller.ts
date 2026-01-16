import { Request, Response } from "express";
import { uploadToCloudinary, saveFile } from "../services/upload.service";

const singleUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      console.log("REQ FILE =>", req.file);
      console.log("REQ BODY =>", req.body);
      return res.status(400).json({ message: "No file" });
    }

    const upload = await uploadToCloudinary(file.buffer);
    const saved = await saveFile(upload.secure_url);

    return res.json(saved);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

const multiUpload = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files" });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const upload = await uploadToCloudinary(file.buffer);

        const saved = await saveFile(upload.secure_url);

        return {
          id: saved.id,
          url: upload.secure_url,
        };
      })
    );

    return res.json({
      success: true,
      data: results,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export { singleUpload, multiUpload };
