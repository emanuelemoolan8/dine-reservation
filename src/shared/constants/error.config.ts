import { ErrorConfig } from "../../interfaces/error.interface";
import { ErrorMessages, ErrorStatusCodes } from "./error.constant";

type ErrorKeys = keyof typeof ErrorMessages;

const createErrorConfig = (key: ErrorKeys): ErrorConfig => ({
  message: ErrorMessages[key] || "Unknown error occurred",
  code: key || "UNKNOWN_ERROR",
  statusCode: ErrorStatusCodes[key] || 500,
});

export const ErrorConfigs: Record<ErrorKeys, ErrorConfig> = Object.keys(
  ErrorMessages
).reduce((configs, key) => {
  configs[key as ErrorKeys] = createErrorConfig(key as ErrorKeys);
  return configs;
}, {} as Record<ErrorKeys, ErrorConfig>);
