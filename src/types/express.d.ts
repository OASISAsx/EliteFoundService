import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: {
      // id: string;
      userId: string;
      roles: string[];
    };

    roleSecret?: string;
    aesKey?: string;
    decryptedBody?: unknown;
  }
}
