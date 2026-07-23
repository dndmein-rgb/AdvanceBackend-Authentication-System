// src/common/utils/send-response.ts

import type { Response } from "express";
import type { ApiResponse } from "../types";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
): Response => {
  return res.status(statusCode).json(payload);
};