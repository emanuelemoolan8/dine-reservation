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

describe("User Routes", () => {
  const validUser = { email: "john@example.com", name: "John" };
  const invalidUser = { name: "John" };

  describe("POST /users", () => {
    it("should create a user and return 201 for valid user data", async () => {
      const response = await request(app).post("/api/v1/users").send(validUser);

      expect(response.status).toBe(201);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toHaveProperty("email", validUser.email);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 400 for invalid user data", async () => {
      const response = await request(app)
        .post("/api/v1/users")
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toHaveProperty("error");
    });

    it("should not allow duplicate users", async () => {
      await request(app).post("/api/v1/users").send(validUser);

      const duplicateResponse = await request(app)
        .post("/api/v1/users")
        .send(validUser);

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body).toHaveProperty("error");
    });
  });
});
