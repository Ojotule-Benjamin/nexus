import user from "../models/user.model.ts";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { STATUS } from "../constants/statusCodes.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  // Registration logic will go here

  const {
    firstName,
    middleName,
    lastName,
    age,
    state,
    country,
    email,
    password,
    phoneNumber,
    role,
    isVerified,
  } = req.body;

  try {
    const existsingUser = await user.findOne({ email });
    if (existsingUser) {
      return ApiResponse.error({
        res,
        status: STATUS.CONFLICT,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await user.create({
      email: email,
      password: hashed,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName ?? undefined,
      age: age,
      state: state,
      country: country,
      phoneNumber: phoneNumber,
      role: role,
      isVerified: isVerified,
    });

    return res.status(STATUS.CREATED).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        middleName: newUser.middleName ?? undefined,
        email: newUser.email,
        age: newUser.age,
        state: newUser.state,
        country: newUser.country,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error: unknown) {
    let errMsg: string | object;
    if (error instanceof Error) {
      errMsg = error.message;
    } else {
      errMsg = error || "Unknown error";
    }

    return ApiResponse.error({ res, error: errMsg });
  }
};

export const login = async (req: Request, res: Response) => {
  // Login logic will go here
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({ email });
    if (!existingUser) {
      return ApiResponse.error({
        res,
        status: STATUS.NOT_FOUND,
        message: "User not found",
      });
    }

    const isPasswwordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswwordValid) {
      return ApiResponse.error({
        res,
        status: STATUS.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "5h" }
    );

    const { password: _pwd, ...userWithoutPassword } = existingUser.toObject();

    return ApiResponse.success({
      res,
      message: "Login successful",
      data: {
        ...userWithoutPassword,
        token,
      },
    });
  } catch (error: unknown) {
    console.log("Login error:", error);
    let errMsg: string | object;
    if (error instanceof Error) {
      console.log("error message", error);
      errMsg = error.message;
    } else {
      errMsg = error || "Unknown error";
    }

    return ApiResponse.error({ res, error: errMsg });
  }
};
