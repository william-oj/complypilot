import { NextFunction, Request, Response } from "express";

export function authorize(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.permissions || [];
    if (permissions.includes("admin") || permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({ error: "Insufficient permissions" });
  };
}
