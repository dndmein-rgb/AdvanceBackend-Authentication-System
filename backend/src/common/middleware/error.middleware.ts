import { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.config.js";
import { AppError } from "../errors/AppError.js";

const NODE_ENV = env.NODE_ENV;

export async function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let error: AppError;
  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new AppError(err.message, 500);
  } else {
    error = new AppError("Something went wrong", 500);
  }

  if (NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err instanceof Error ? error.stack : undefined,
      error,
    });
  }
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      status: error.status,
      message: error.message,
    });
  }
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    status: "error",
  });
}
