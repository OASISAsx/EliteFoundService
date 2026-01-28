import cloudinary from "../lib/cloudinary";
import prisma from "../prisma/client";

export const uploadToCloudinary = async (buffer: Buffer) => {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "uploads" }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
      .end(buffer);
  });
};

export const saveFile = async (url: string) => {
  return prisma.fileUpload.create({
    data: { url },
  });
};
