import { Request, Response } from "express";
import { pipe } from "fp-ts/function";
import { fold } from "fp-ts/Either";
import * as E from "fp-ts/Either";
import { AppError } from "../../types/error.types";
import { toISOString } from "../../utils/time-utils";

export const handleAppError = (
  error: AppError,
  req: Request,
  res: Response
): Response => {
  return res.status(error.statusCode || 500).json({
    status: "error",
    statusCode: error.statusCode || 500,
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "An unexpected error occurred",
      details: error.details || null,
      timestamp: toISOString(new Date()),
      path: req.originalUrl || "",
    },
  });
};

export const handleEither = <L, R>(
  either: E.Either<L, R>,
  onError: (left: L) => AppError,
  onSuccess: (right: R) => void
): void => {
  pipe(
    either,
    fold(
      (left) => {
        throw onError(left);
      },
      (right) => {
        onSuccess(right);
      }
    )
  );
};
