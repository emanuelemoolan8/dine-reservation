import { Router } from "express";
import {
  createReservation,
  getReservationsByDateRange,
  deleteReservation,
} from "../controllers/reservation.controller";
import {
  getReservationsInDateRange,
  makeReservation,
  deleteReservation as deleteReservationService,
} from "../services/reservation.service";
import {
  validateDateRange,
  validateNumberOfSeats,
  validateReservation,
  validateReservationTime,
  validateReservationTimeFormat,
  validateTableNumberForGet,
  validateTableNumberForPost,
} from "../../../middleware/validations/reservationValidation";

const reservationService = {
  makeReservation,
  getReservationsInDateRange,
  deleteReservation: deleteReservationService,
};

const router = Router();

router.post(
  "/",
  validateReservation,
  validateReservationTimeFormat,
  validateTableNumberForPost,
  validateNumberOfSeats,
  validateReservationTime,
  createReservation(reservationService)
);

router.get(
  "/",
  validateDateRange,
  validateTableNumberForGet,
  getReservationsByDateRange(reservationService)
);

router.delete("/:id", deleteReservation(reservationService));

export default router;
