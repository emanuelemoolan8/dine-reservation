import prisma from "../../../utils/prisma";
import { Reservation } from "@prisma/client";
import {
  CreateReservationInput,
  ReservationRepository,
} from "../../../interfaces/reservation.interface";
import { MAX_TABLES } from "../../../shared/constants";

export const createReservation: ReservationRepository["createReservation"] =
  async (data: CreateReservationInput): Promise<Reservation> => {
    return prisma.reservation.create({
      data,
      select: {
        id: true,
        userId: true,
        tableNumber: true,
        numberOfSeats: true,
        reservationTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

export const findReservationsByTableAndTime: ReservationRepository["findReservationsByTableAndTime"] =
  async (
    tableNumber: number,
    reservationTime: Date
  ): Promise<Reservation[]> => {
    return prisma.reservation.findMany({
      where: {
        tableNumber,
        reservationTime,
      },
      select: {
        id: true,
        userId: true,
        tableNumber: true,
        numberOfSeats: true,
        reservationTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

export const findReservationsByDateRange: ReservationRepository["findReservationsByDateRange"] =
  async (
    start: Date,
    end: Date,
    page: number,
    pageSize: number,
    tableNumber?: number
  ): Promise<Reservation[]> => {
    const whereClause: any = {
      reservationTime: {
        gte: start,
        lte: end,
      },
    };

    if (tableNumber !== undefined) {
      whereClause.tableNumber = tableNumber;
    }

    return prisma.reservation.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        userId: true,
        tableNumber: true,
        numberOfSeats: true,
        reservationTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

export const findReservationById: ReservationRepository["findReservationById"] =
  async (id: number): Promise<Reservation | null> => {
    return prisma.reservation.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        tableNumber: true,
        numberOfSeats: true,
        reservationTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  };

export const deleteReservationById: ReservationRepository["deleteReservation"] =
  async (id: number): Promise<void> => {
    await prisma.reservation.delete({
      where: { id },
    });
  };

export const findReservationsByTableAndTimeRange = async (
  tableNumber: number,
  reservationTime: Date,
  durationInHours: number
) => {
  const timeBefore = new Date(reservationTime);
  timeBefore.setHours(timeBefore.getHours() - durationInHours);

  const timeAfter = new Date(reservationTime);
  timeAfter.setHours(timeAfter.getHours() + durationInHours);

  return prisma.reservation.findMany({
    where: {
      tableNumber,
      reservationTime: {
        gt: timeBefore,
        lt: timeAfter,
      },
    },
    select: {
      numberOfSeats: true,
      reservationTime: true,
    },
  });
};

export const findAvailableTables = async (
  reservationTime: Date,
  durationInHours: number
): Promise<number[]> => {
  const reservedTables = await prisma.reservation.findMany({
    where: {
      reservationTime: {
        gte: reservationTime,
        lt: new Date(
          reservationTime.getTime() + durationInHours * 60 * 60 * 1000
        ),
      },
    },
    select: {
      tableNumber: true,
    },
  });

  const allTables = Array.from({ length: MAX_TABLES }, (_, i) => i + 1);
  const reservedTableNumbers = reservedTables.map((r) => r.tableNumber);
  const availableTables = allTables.filter(
    (tableNumber) => !reservedTableNumbers.includes(tableNumber)
  );

  return availableTables;
};
