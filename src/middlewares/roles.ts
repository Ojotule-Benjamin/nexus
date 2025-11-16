import express, { type Response, type NextFunction } from "express";
import { type AuthRequest, type IUser } from "../types/index.ds.ts";

export const permit = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden: You don't have enough permissions to access this resource.",
      });
    }
    next();
  };
};
