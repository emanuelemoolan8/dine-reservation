import { Request, Response, NextFunction } from "express";
import { AppError } from "../../types/error.types";
import { toISOString } from "../../utils/time-utils";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    error: {
      code:
        err.code ||
        (statusCode === 400 ? "VALIDATION_ERROR" : "INTERNAL_ERROR"),
      message: err.message || "An unexpected error occurred",
      details: err.details || err.stack || "No further details available.",
      timestamp: toISOString(new Date()),
      path: req.originalUrl || "",
    },
  });
};
