import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { AppError } from "@/common/errors/app-error";
import type { ParamsDictionary } from "express-serve-static-core";

type ValidationTarget = "body" | "params" | "query";

export const validate =
  <T>(schema: ZodType<T>, target: ValidationTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      throw new AppError(
        result.error.issues
          .map(({ path, message }) => `${path.join(".")}:${message}`)
          .join(","),
        400,
      );
    }
    switch (target) {
      case "body":
        req.body = result.data;
        break;

      case "params":
        req.params = result.data as ParamsDictionary;
        break;

      case "query":
        req.query = result.data as Request["query"];
        break;
    }

    next();
  };
