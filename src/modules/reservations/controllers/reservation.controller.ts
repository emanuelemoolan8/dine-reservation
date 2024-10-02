import { NextFunction, Request, Response } from "express";
import { ReservationService } from "../../../interfaces/reservation.interface";
import { handleResponse } from "../../../shared/helpers/response.helper";

export const createReservation =
  (reservationService: ReservationService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, tableNumber, numberOfSeats, reservationTime } = req.body;

    const task = reservationService.makeReservation({
      userId,
      tableNumber,
      numberOfSeats,
      reservationTime,
    });

    await handleResponse(req, res, task, 201).catch(next);
  };

export const getReservationsByDateRange =
  (reservationService: ReservationService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { start, end, page = 1, pageSize = 10, tableNumber } = req.query;

    const task = reservationService.getReservationsInDateRange(
      start as string,
      end as string,
      parseInt(page as string, 10),
      parseInt(pageSize as string, 10),
      tableNumber ? parseInt(tableNumber as string, 10) : undefined
    );

    await handleResponse(req, res, task, 200).catch(next);
  };

export const deleteReservation =
  (reservationService: ReservationService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    const reservationId = Number(id);
    if (isNaN(reservationId)) {
      res.status(400).json({ error: "Invalid reservation ID" });
      return;
    }

    const task = reservationService.deleteReservation(reservationId);

    await handleResponse(req, res, task, 204).catch(next);
  };
