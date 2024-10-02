export type AppError = {
  code: string;
  message: string;
  details?: string;
  statusCode: number;
  isOperational?: boolean;
  timestamp?: string;
  path?: string;
  stack?: string;
};
