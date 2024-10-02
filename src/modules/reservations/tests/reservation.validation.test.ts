import { Request, Response, NextFunction } from "express";
import {
  validateReservation,
  validateDateRange,
  validateNumberOfSeats,
  validateTableNumberForPost,
} from "../../../middleware/validations/reservationValidation";
import * as E from "fp-ts/Either";
import {
  DateRangeQuery,
  ReservationCodec,
} from "../../../types/reservation.types";
import prisma from "../../../utils/prisma";
import { MIN_TABLES, MAX_TABLES } from "../../../shared/constants";

jest.mock("../../../types/user.types", () => ({
  UserCodec: {
    decode: jest.fn(),
  },
}));

jest.mock("../../../shared/helpers/error.helper", () => ({
  createError: jest.fn((errorDetails) => ({
    statusCode: errorDetails.statusCode,
    code: errorDetails.code,
    message: errorDetails.message || "Validation failed",
    details: errorDetails.details || null,
  })),
}));

jest.mock("../../../types/reservation.types", () => ({
  DateRangeQuery: {
    decode: jest.fn(),
  },
  ReservationCodec: {
    decode: jest.fn(),
  },
}));

jest.mock("../../../utils/prisma", () => ({
  reservation: {
    findMany: jest.fn(),
  },
}));

const setupMocks = () => {
  const req: Partial<Request> = { body: {}, query: {} };
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: NextFunction = jest.fn();
  return { req, res, next };
};

describe("validateReservation", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    ({ req, res, next } = setupMocks());
  });

  it("should pass validation and call next if request is valid", () => {
    (ReservationCodec.decode as jest.Mock).mockReturnValue(E.right(req.body));

    validateReservation(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if request is invalid", () => {
    const validationErrors = [{ message: "Invalid reservation data" }];
    (ReservationCodec.decode as jest.Mock).mockReturnValue(
      E.left(validationErrors)
    );

    validateReservation(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        status: "error",
        error: expect.objectContaining({ code: "GENERAL_VALIDATION_FAILED" }),
      })
    );
  });
});

describe("validateDateRange", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    ({ req, res, next } = setupMocks());
    req.query = { start: "2024-01-01", end: "2024-01-02" };
  });

  it("should return 400 if date format is invalid", () => {
    (DateRangeQuery.decode as jest.Mock).mockReturnValue(
      E.left([{ message: "Invalid date range" }])
    );

    validateDateRange(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        status: "error",
        error: expect.objectContaining({ code: "GENERAL_VALIDATION_FAILED" }),
      })
    );
  });
});

describe("validateNumberOfSeats", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    ({ req, res, next } = setupMocks());
    req.body = {
      tableNumber: 1,
      reservationTime: new Date(),
      numberOfSeats: 4,
    };
  });

  it("should pass validation and call next if seats are available", async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
      { numberOfSeats: 2 },
    ]);

    await validateNumberOfSeats(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("validateTableNumber", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    ({ req, res, next } = setupMocks());
  });

  it("should pass validation and call next if table number is valid", () => {
    req.body.tableNumber = 5;

    validateTableNumberForPost(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if table number is below minimum", () => {
    req.body.tableNumber = MIN_TABLES - 1;

    validateTableNumberForPost(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        status: "error",
        error: expect.objectContaining({ code: "GENERAL_VALIDATION_FAILED" }),
      })
    );
  });

  it("should return 400 if table number is above maximum", () => {
    req.body.tableNumber = MAX_TABLES + 1;

    validateTableNumberForPost(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        status: "error",
        error: expect.objectContaining({ code: "GENERAL_VALIDATION_FAILED" }),
      })
    );
  });
});
