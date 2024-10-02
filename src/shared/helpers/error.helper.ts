import { ErrorConfig } from "../../interfaces/error.interface";
import { AppError } from "../../types/error.types";
import { ErrorMessages, ErrorStatusCodes } from "../constants/error.constant";

export const formatErrorResponse = (message: string) => ({
  error: message,
});

export const logError = (error: Error) => {
  console.error(error.message);
};

export const handleError = (error: unknown, message?: string): Error => {
  console.error(message, error);
  return new Error(message);
};

export const createError = (
  errorConfig: ErrorConfig = {
    message: ErrorMessages.GENERAL_SERVER_ERROR,
    code: "GENERAL_SERVER_ERROR",
    statusCode: ErrorStatusCodes.GENERAL_SERVER_ERROR,
    details: ErrorMessages.GENERAL_SERVER_ERROR,
  }
): AppError => ({
  code: errorConfig.code,
  message: errorConfig.message,
  details: errorConfig.details || errorConfig.message,
  statusCode: errorConfig.statusCode,
  isOperational: true,
});
