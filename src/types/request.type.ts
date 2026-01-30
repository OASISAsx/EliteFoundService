// src/types/request.ts
import { Request } from "express";

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };

  auth?: {
    // id: string;
    userId: string;
    roles: string[];
  };

  roleSecret?: string;
  aesKey?: string;
  decryptedBody?: any;
}
