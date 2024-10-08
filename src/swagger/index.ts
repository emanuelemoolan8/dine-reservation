import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const apisPath =
  process.env.NODE_ENV === "production"
    ? ["./dist/modules/**/*.js"]
    : ["./src/modules/**/*.ts"];

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dine Reservation Service API",
      version: "1.0.0",
      description: "API for managing restaurant reservations",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
  },
  apis: apisPath,
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
