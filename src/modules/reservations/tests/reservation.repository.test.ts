import prisma from "../../../utils/prisma";
import {
  createReservation,
  findReservationsByDateRange,
} from "../repositories/reservation.repository";

jest.mock("../../../utils/prisma", () => ({
  reservation: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("Reservation Repository - createReservation", () => {
  it("should create a new reservation", async () => {
    const data = {
      userId: 1,
      tableNumber: 2,
      numberOfSeats: 4,
      reservationTime: new Date(),
    };
    const mockReservation = { id: 1, ...data };

    (prisma.reservation.create as jest.Mock).mockResolvedValue(mockReservation);

    const result = await createReservation(data);

    expect(result).toEqual(mockReservation);
    expect(prisma.reservation.create).toHaveBeenCalledWith({
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
  });
});

describe("Reservation Repository - findReservationsByDateRange", () => {
  it("should return reservations within the specified date range", async () => {
    const start = new Date("2024-01-01");
    const end = new Date("2024-01-02");
    const page = 1;
    const pageSize = 10;
    const table = undefined;
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        tableNumber: 2,
        numberOfSeats: 4,
        reservationTime: new Date(),
      },
    ];

    (prisma.reservation.findMany as jest.Mock).mockResolvedValue(
      mockReservations
    );

    const result = await findReservationsByDateRange(
      start,
      end,
      page,
      pageSize,
      table
    );

    expect(result).toEqual(mockReservations);
  });
});
