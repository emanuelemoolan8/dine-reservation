import * as t from "io-ts";
import { Request, Response, NextFunction } from "express";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";
import { parseISO, isValid } from "date-fns";
import { handleAppError } from "../handlers/errorHandler";
import { createError } from "../../shared/helpers/error.helper";
import { ErrorConfigs } from "../../shared/constants/error.config";
import {
  MAX_TABLES,
  MIN_TABLES,
  SEATS_PER_TABLE,
} from "../../shared/constants";
import {
  DateRangeQuery,
  ReservationCodec,
} from "../../types/reservation.types";
import { CLOSING_HOUR, OPENING_HOUR } from "../../utils/time-utils";

// helpers
const handleValidationError = (
  errorMessage: string,
  req: Request,
  res: Response,
  details?: string
): void => {
  const error = createError({
    ...ErrorConfigs.GENERAL_VALIDATION_FAILED,
    message: errorMessage,
    details: details || "Validation failed",
  });
  handleAppError(error, req, res);
};

const handleEitherError = <A>(
  either: E.Either<string, A>,
  details: string,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  pipe(
    either,
    E.fold(
      (errorMessage) => handleValidationError(errorMessage, req, res, details),
      () => next()
    )
  );
};

const validateDecoded = <A>(
  codec: t.Decoder<unknown, A>,
  input: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  pipe(
    codec.decode(input),
    E.fold(
      (errors) =>
        handleValidationError(
          "Validation failed. Please check that you have filled all the fields correctly.",
          req,
          res,
          PathReporter.report(E.left(errors)).join(", ")
        ),
      () => next()
    )
  );
};

const validateUTCString = (time: string): E.Either<string, void> => {
  const parsedTime = parseISO(time);

  if (!isValid(parsedTime)) {
    return E.left("Invalid date format. Please provide a valid ISO string.");
  }

  if (!time.endsWith("Z")) {
    return E.left(
      "Invalid time format. The time must be in UTC and end with 'Z'."
    );
  }

  return E.right(undefined);
};

export const validateDateRange = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validateDecoded(DateRangeQuery, req.query, req, res, () => {
    const { start, end } = req.query as { start: string; end: string };

    const eitherValidDate = pipe(
      validateUTCString(start),
      E.chain(() => validateUTCString(end))
    );

    handleEitherError(
      eitherValidDate,
      "Validate Date Range Failed",
      req,
      res,
      next
    );
  });
};

export const validateReservation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  validateDecoded(ReservationCodec, req.body, req, res, next);
};

export const validateReservationTimeFormat = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { reservationTime } = req.body;

  const eitherValidDateFormat = validateUTCString(reservationTime);

  handleEitherError(
    eitherValidDateFormat,
    "Validate Reservation Time Format Failed",
    req,
    res,
    next
  );
};

export const validateReservationTime = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { reservationTime } = req.body;
  const time = parseISO(reservationTime);

  const eitherTimeValid =
    time.getUTCHours() < OPENING_HOUR || time.getUTCHours() >= CLOSING_HOUR
      ? E.left(
          "Invalid reservation time. Reservations are only allowed between 19:00 and 00:00 (UTC equivalent: 15:00 to 22:00)."
        )
      : E.right(undefined);

  handleEitherError(
    eitherTimeValid,
    "Validate Reservation Time Failed",
    req,
    res,
    next
  );
};

export const validateNumberOfSeats = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { numberOfSeats } = req.body;

  const eitherSeatsValid =
    numberOfSeats < 1
      ? E.left("The number of seats must be greater than 0.")
      : numberOfSeats > SEATS_PER_TABLE
      ? E.left("Please check the number of seats. The table has only 4 seats.")
      : E.right(undefined);

  handleEitherError(
    eitherSeatsValid,
    "Validate Number Of Seats Failed",
    req,
    res,
    next
  );
};

const validateTableNumberCore = (
  tableNumber: string | undefined,
  isRequired: boolean
): E.Either<string, void> => {
  if (!tableNumber && !isRequired) {
    return E.right(undefined);
  }

  const parsedTableNumber = parseInt(tableNumber as string, 10);

  return isNaN(parsedTableNumber) || parsedTableNumber < MIN_TABLES
    ? E.left(
        `Invalid table number. Table number cannot be less than ${MIN_TABLES}.`
      )
    : parsedTableNumber > MAX_TABLES
    ? E.left(
        `Invalid table number. The restaurant only has ${MAX_TABLES} tables.`
      )
    : E.right(undefined);
};

export const validateTableNumberForPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { tableNumber } = req.body;

  const eitherTableValid = validateTableNumberCore(tableNumber, true);

  handleEitherError(
    eitherTableValid,
    "Validate Table Number Failed (POST)",
    req,
    res,
    next
  );
};

export const validateTableNumberForGet = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { tableNumber } = req.query;

  const eitherTableValid = validateTableNumberCore(
    tableNumber as string,
    false
  );

  handleEitherError(
    eitherTableValid,
    "Validate Table Number Failed (GET)",
    req,
    res,
    next
  );
};
