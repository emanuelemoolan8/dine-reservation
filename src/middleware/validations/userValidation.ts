import { Request, Response, NextFunction } from "express";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";
import { handleAppError } from "../handlers/errorHandler";
import { createError } from "../../shared/helpers/error.helper";
import { ErrorConfigs } from "../../shared/constants/error.config";
import { UserCodec } from "../../types/user.types";
import { Errors } from "io-ts";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validationResult = UserCodec.decode(req.body);
  pipe(
    validationResult,
    E.fold(
      (errors: Errors) => {
        const errorDetail = PathReporter.report(E.left(errors)).join(", ");

        const validationError = createError({
          ...ErrorConfigs.GENERAL_VALIDATION_FAILED,
          statusCode: 400,
          details: errorDetail,
        });
        handleAppError(validationError, req, res);
      },
      (validatedUser) => {
        req.body = validatedUser;
        next();
      }
    )
  );
};
