import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import {
  CreateUserInput,
  UserService,
  User,
} from "../../../interfaces/user.interface";
import {
  createUser,
  findAllUsers,
  findUserByEmail,
} from "../repositories/user.repository";
import { createError } from "../../../shared/helpers/error.helper";
import { AppError } from "../../../types/error.types";
import { ErrorConfigs } from "../../../shared/constants/error.config";
import { errorDetails } from "../../../shared/constants/error.constant";

export const registerUser: UserService["registerUser"] = (
  data: CreateUserInput
): TE.TaskEither<AppError, User> =>
  pipe(
    TE.tryCatch(
      () => findUserByEmail(data.email),
      (error) =>
        createError({
          ...ErrorConfigs.USER_EMAIL_CHECK_FAILED,
          details: error instanceof Error ? error.message : undefined,
        })
    ),
    TE.chain((existingUser) =>
      existingUser
        ? TE.left(
            createError({
              ...ErrorConfigs.USER_EMAIL_ALREADY_EXISTS,
              details: errorDetails.USER_EMAIL_ALREADY_EXISTS,
            })
          )
        : TE.tryCatch(
            () => createUser(data),
            (error) =>
              createError({
                ...ErrorConfigs.USER_CREATION_FAILED,
                details: error instanceof Error ? error.message : undefined,
              })
          )
    )
  );

export const getAllUsers: UserService["getAllUsers"] = (): TE.TaskEither<
  AppError,
  User[]
> =>
  TE.tryCatch(
    () => findAllUsers(),
    (error) =>
      createError({
        ...ErrorConfigs.USER_NOT_FOUND,
        details:
          error instanceof Error ? error.message : errorDetails.UNKNOWN_ERROR,
      })
  );
