import { NextFunction, Request, Response } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
export const asycnHandler = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<AsyncHandler>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
