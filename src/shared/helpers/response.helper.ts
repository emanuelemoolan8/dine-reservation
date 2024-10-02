import { Request, Response, NextFunction } from "express";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import { handleAppError } from "../../middleware/handlers/errorHandler";
import { AppError } from "../../types/error.types";

export const handleResponse = <T>(
  req: Request,
  res: Response,
  taskEither: TE.TaskEither<AppError, T>,
  successStatus: number = 200
): Promise<void> => {
  return pipe(
    taskEither,
    TE.fold(
      (error) => async () => {
        handleAppError(error, req, res);
      },
      (data) => async () => {
        res.status(successStatus).json(data);
      }
    )
  )();
};
