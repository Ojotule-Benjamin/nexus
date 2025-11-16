import type { Response } from "express";
import { STATUS } from "../constants/statusCodes.ts";
import type { ApiResponseOptions } from "../types/index.ds.ts";
import { stat } from "fs";

export class ApiResponse {
  static success<T = unknown>({
    res,
    status = STATUS.OK,
    message = "Successs",
    data,
  }: ApiResponseOptions<T>) {
    return res.status(status).json({
      success: true,
      message,
      data: data ?? null,
    });
  }

  static error<T = unknown>({
    res,
    status = STATUS.INTERNAL_ERROR,
    message = "opps! Something went wrong!",
    error,
  }: ApiResponseOptions<T>) {
    return res.status(status).json({
      success: false,
      message,
      error: error ?? undefined,
    });
  }
}
