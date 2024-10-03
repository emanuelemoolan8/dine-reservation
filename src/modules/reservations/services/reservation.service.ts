import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import {
  ReservationClient,
  CreateReservationInputClient,
  ReservationService,
} from "../../../interfaces/reservation.interface";
import {
  createReservation,
  findReservationsByTableAndTimeRange,
  findReservationById,
  deleteReservationById,
  findReservationsByDateRange,
  findAvailableTables,
} from "../repositories/reservation.repository";
import prisma from "../../../utils/prisma";
import { createError } from "../../../shared/helpers/error.helper";
import { AppError } from "../../../types/error.types";
import { ErrorConfigs } from "../../../shared/constants/error.config";
import { SEATS_PER_TABLE } from "../../../shared/constants";
import { errorDetails } from "../../../shared/constants/error.constant";
import {
  CLOSING_HOUR,
  OPENING_HOUR,
  toISOString,
  toUTC,
} from "../../../utils/time-utils";

const checkUserExists = (userId: number) =>
  pipe(
    TE.tryCatch(
      () => prisma.user.findUnique({ where: { id: userId } }),
      (error) =>
        createError({
          ...ErrorConfigs.USER_FETCH_FAILED,
          details:
            error instanceof Error ? error.message : errorDetails.UNKNOWN_ERROR,
        })
    ),
    TE.chain((user) =>
      user
        ? TE.right(undefined)
        : TE.left(
            createError({
              ...ErrorConfigs.USER_NOT_FOUND,
              details: errorDetails.USER_NOT_FOUND,
            })
          )
    )
  );

const checkReservationExists = (id: number) =>
  pipe(
    TE.tryCatch(
      () => findReservationById(id),
      (error) =>
        createError({
          ...ErrorConfigs.RESERVATION_FETCH_FAILED,
          details:
            error instanceof Error ? error.message : errorDetails.UNKNOWN_ERROR,
        })
    ),
    TE.chain((reservation) =>
      reservation
        ? TE.right(reservation)
        : TE.left(
            createError({
              ...ErrorConfigs.RESERVATION_NOT_FOUND,
              details: errorDetails.RESERVATION_NOT_FOUND,
            })
          )
    )
  );

const checkSeatsAndSuggestAlternative = (
  tableNumber: number,
  requestedSeats: number,
  reservationTime: Date,
  durationInHours: number
): TE.TaskEither<AppError, void> =>
  pipe(
    TE.tryCatch(
      async () => {
        const existingReservations = await findReservationsByTableAndTimeRange(
          tableNumber,
          reservationTime,
          durationInHours
        );
        const seatsAlreadyReserved = existingReservations.reduce(
          (total, reservation) => total + (reservation.numberOfSeats ?? 0),
          0
        );
        const remainingSeats = SEATS_PER_TABLE - seatsAlreadyReserved;

        if (remainingSeats >= requestedSeats) {
          return { nextAvailableTime: null, availableTables: [] };
        }

        const lastReservation =
          existingReservations[existingReservations.length - 1];
        const utcReservationTime = new Date(reservationTime.toUTCString());

        let checkAvailableTime = new Date(
          utcReservationTime.getTime() + durationInHours * 60 * 60 * 1000
        );

        const nextAvailableHour = checkAvailableTime.getUTCHours();
        if (nextAvailableHour >= CLOSING_HOUR) {
          const nextDay = new Date(checkAvailableTime);
          nextDay.setUTCDate(nextDay.getUTCDate() + 1);
          nextDay.setUTCHours(OPENING_HOUR, 0, 0, 0);
          checkAvailableTime = nextDay;
        }

        const nextAvailableTime = checkAvailableTime.toISOString();

        const availableTables = await findAvailableTables(
          reservationTime,
          durationInHours
        );

        return { nextAvailableTime, availableTables };
      },
      (error) =>
        createError({
          ...ErrorConfigs.RESERVATION_TABLE_CHECK_FAILED,
          details:
            error instanceof Error ? error.message : errorDetails.UNKNOWN_ERROR,
        })
    ),
    TE.chain(({ nextAvailableTime, availableTables }) => {
      if (nextAvailableTime) {
        const alternativeMessage =
          `This table is fully booked. Try again after ${nextAvailableTime} (UTC).` +
          (availableTables.length > 0
            ? ` Or you can select another table. Available tables: ${availableTables.join(
                ", "
              )}`
            : "");
        return TE.left(
          createError({
            ...ErrorConfigs.OVERBOOKING_NOT_ALLOWED,
            message: alternativeMessage,
            details: errorDetails.OVERBOOKING_NOT_ALLOWED,
          })
        );
      }
      return TE.right(undefined);
    })
  );

export const makeReservation: ReservationService["makeReservation"] = ({
  userId,
  tableNumber,
  numberOfSeats,
  reservationTime,
}: CreateReservationInputClient): TE.TaskEither<AppError, ReservationClient> =>
  pipe(
    checkUserExists(userId),
    TE.chain(() =>
      checkSeatsAndSuggestAlternative(
        tableNumber,
        numberOfSeats,
        new Date(toUTC(reservationTime)),
        1 // 1-hour duration for the reservation
      )
    ),
    TE.chain(() =>
      TE.tryCatch(
        () =>
          createReservation({
            userId,
            tableNumber,
            numberOfSeats,
            reservationTime: new Date(toUTC(reservationTime)),
          }),
        (error) =>
          createError({
            ...ErrorConfigs.RESERVATION_CREATION_FAILED,
            details:
              error instanceof Error
                ? error.message
                : errorDetails.UNKNOWN_ERROR,
          })
      )
    ),
    TE.map((reservation) => ({
      ...reservation,
      reservationTime: toISOString(reservation.reservationTime),
    }))
  );

export const getReservationsInDateRange: ReservationService["getReservationsInDateRange"] =
  (
    start: string,
    end: string,
    page: number,
    pageSize: number,
    tableNumber?: number
  ): TE.TaskEither<AppError, ReservationClient[]> =>
    pipe(
      TE.tryCatch(
        () =>
          findReservationsByDateRange(
            new Date(toUTC(start)),
            new Date(toUTC(end)),
            page,
            pageSize,
            tableNumber
          ),
        (error) =>
          createError({
            ...ErrorConfigs.RESERVATION_DATE_RANGE_FETCH_FAILED,
            details:
              error instanceof Error
                ? error.message
                : errorDetails.UNKNOWN_ERROR,
          })
      ),
      TE.map((reservations) =>
        reservations.map((reservation) => ({
          ...reservation,
          reservationTime: toISOString(reservation.reservationTime),
        }))
      )
    );

export const deleteReservation: ReservationService["deleteReservation"] = (
  id: number
): TE.TaskEither<AppError, void> =>
  pipe(
    checkReservationExists(id),
    TE.chain(() =>
      TE.tryCatch(
        () => deleteReservationById(id),
        (error) =>
          createError({
            ...ErrorConfigs.RESERVATION_DELETION_FAILED,
            details:
              error instanceof Error
                ? error.message
                : errorDetails.UNKNOWN_ERROR,
          })
      )
    )
  );
