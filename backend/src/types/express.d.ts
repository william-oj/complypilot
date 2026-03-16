import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      orgId?: string;
      permissions?: string[];
      file?: Express.Multer.File;
    }
  }
}
