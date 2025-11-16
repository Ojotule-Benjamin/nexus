import { Document } from "mongoose";
import type { Response } from "express";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  state: string;
  country: string;
  phoneNumber: string;
  role: "user" | "admin";
  isVerified: boolean;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponseOptions<T = unknown> {
  res: Response;
  status?: number;
  message?: string;
  data?: T;
  error?: string | object;
}
