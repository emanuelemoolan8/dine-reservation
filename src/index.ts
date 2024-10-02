import { setupSwagger } from "./swagger";
import express, { Request, Response, NextFunction } from "express";
import router from "./routes";
import { createError } from "./shared/helpers/error.helper";
import { ErrorConfigs } from "./shared/constants/error.config";
import { globalErrorHandler } from "./middleware/handlers/globalErrorHandler";
// import { requestLogger } from "./middleware/log/requestLogger";

import cors from "cors";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cors());
// logging all incoming requests
// app.use(requestLogger);

app.use(express.json());

setupSwagger(app);

app.use("/api/v1", router);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = createError({
    ...ErrorConfigs.GENERAL_RESOURCE_NOT_FOUND,
    statusCode: 404,
    details: `Cannot find ${req.originalUrl} on this server`,
  });
  next(error);
});

app.use(globalErrorHandler);

export default app;
