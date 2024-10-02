import request from "supertest";
import app from "../../../..";
import { Server } from "http";
import prisma from "../../../../utils/prisma";

let server: Server;
let port: number;

beforeAll(async () => {
  port = Math.floor(Math.random() * (65535 - 1024) + 1024);
  server = app.listen(port, () => {});
});

afterAll(async () => {
  await prisma.$disconnect();

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

afterEach(async () => {
  await prisma.reservation.deleteMany();
  await prisma.user.deleteMany();
});

describe("GET /reservations", () => {
  const startDate = "2024-01-01T00:00:00Z";
  const endDate = "2024-01-02T00:00:00Z";

  it("should return 200 and reservations within the date range", async () => {
    const mockUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
      },
    });

    await prisma.reservation.create({
      data: {
        userId: mockUser.id,
        tableNumber: 2,
        numberOfSeats: 4,
        reservationTime: new Date(startDate),
      },
    });

    const res = await request(app)
      .get("/api/v1/reservations")
      .query({ start: startDate, end: endDate })
      .expect(200);

    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should return 200 and an empty array if no reservations are found", async () => {
    const res = await request(app)
      .get("/api/v1/reservations")
      .query({ start: startDate, end: endDate })
      .expect(200);

    expect(res.body).toEqual([]);
  });

  it("should return 400 if date range is invalid", async () => {
    const res = await request(app)
      .get("/api/v1/reservations")
      .query({ start: "invalid-date", end: "2024-01-02T00:00:00Z" })
      .expect(400);

    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("message");
  });
});
