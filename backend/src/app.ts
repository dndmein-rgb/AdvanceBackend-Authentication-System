import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "@/common/middleware/error.middleware.js";
import { AppError } from "@/common/errors/app-error.js";

export const app = express();

// app.set("trust proxy",1)

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/health-check", (_, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "App is working fine",
  });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Cannot find ${req.originalUrl} on this server`,
      404
    ),
  );
});
app.use(globalErrorHandler);
