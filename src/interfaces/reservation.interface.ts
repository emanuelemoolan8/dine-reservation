import * as TE from "fp-ts/TaskEither";
import { AppError } from "../types/error.types";

// Shared Client and Internal Interfaces
interface ReservationBase {
  userId: number;
  tableNumber: number;
  numberOfSeats: number;
}

// Client Interfaces
export interface ReservationClient extends ReservationBase {
  id: number;
  reservationTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInputClient extends ReservationBase {
  reservationTime: string;
}

// Internal Interfaces
export interface Reservation extends ReservationBase {
  id: number;
  reservationTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInput extends ReservationBase {
  reservationTime: Date;
}

// Service
export interface ReservationService {
  makeReservation(
    data: CreateReservationInputClient
  ): TE.TaskEither<AppError, ReservationClient>;

  getReservationsInDateRange(
    start: string | Date,
    end: string | Date,
    page: number,
    pageSize: number,
    table?: number
  ): TE.TaskEither<AppError, ReservationClient[]>;

  deleteReservation(id: number): TE.TaskEither<AppError, void>;
}

// Repository
export interface ReservationRepository {
  createReservation(data: CreateReservationInput): Promise<Reservation>;

  findReservationsByTableAndTime(
    tableNumber: number,
    reservationTime: Date
  ): Promise<Reservation[]>;

  findReservationsByDateRange(
    start: Date,
    end: Date,
    page: number,
    pageSize: number,
    table?: number
  ): Promise<Reservation[]>;

  findReservationById(id: number): Promise<Reservation | null>;

  deleteReservation(id: number): Promise<void>;
}
