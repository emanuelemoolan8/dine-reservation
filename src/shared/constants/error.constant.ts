export const ErrorMessages = {
  // Reservation Errors
  RESERVATION_TABLE_CHECK_FAILED:
    "We are unable to check if the table is available at the moment.",
  RESERVATION_TABLE_ALREADY_BOOKED:
    "The table you've chosen is already reserved for the selected time.",
  RESERVATION_CREATION_FAILED:
    "We were unable to create your reservation. Please try again.",
  RESERVATION_DATE_RANGE_FETCH_FAILED:
    "We couldn’t fetch reservations for the selected dates. Please check the date range and try again.",
  RESERVATION_FETCH_FAILED:
    "We were unable to retrieve the reservation details.",
  RESERVATION_UPDATE_FAILED:
    "We couldn’t update your reservation. Please check the details and try again.",
  RESERVATION_DELETION_FAILED:
    "We couldn’t delete your reservation. Please try again.",
  RESERVATION_NOT_FOUND: "No reservation was found associated with this user.",

  // User Errors
  USER_EMAIL_CHECK_FAILED:
    "We were unable to check whether this email is already registered.",
  USER_EMAIL_ALREADY_EXISTS:
    "This email is already registered. Please use a different one or log in.",
  USER_CREATION_FAILED: "We couldn’t create your account. Please try again.",
  USER_NOT_FOUND: "We couldn’t find this user. If you're new, please sign up.",
  USER_FETCH_FAILED:
    "We were unable to retrieve user information at this time.",

  // General Errors
  GENERAL_VALIDATION_FAILED:
    "Some information you provided is not valid. Please check and try again.",
  GENERAL_RESOURCE_NOT_FOUND:
    "The item or page you're looking for cannot be found.",
  GENERAL_SERVER_ERROR:
    "Something went wrong on our end. Please try again later.",
  INVALID_DATE_FORMAT:
    "The date format entered is invalid. Please follow the correct format.",
  OVERBOOKING_NOT_ALLOWED:
    "There is a limit of 4 people per table. Please adjust your booking accordingly.",
} as const;

// Error Status Codes
const StatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type ErrorKeys = keyof typeof ErrorMessages;
export const ErrorStatusCodes: Record<
  ErrorKeys,
  (typeof StatusCodes)[keyof typeof StatusCodes]
> = {
  // Reservation Status Codes
  RESERVATION_TABLE_CHECK_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_TABLE_ALREADY_BOOKED: StatusCodes.CONFLICT,
  RESERVATION_CREATION_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_DATE_RANGE_FETCH_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_FETCH_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_UPDATE_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_DELETION_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  RESERVATION_NOT_FOUND: StatusCodes.NOT_FOUND,

  // User Status Codes
  USER_EMAIL_CHECK_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  USER_EMAIL_ALREADY_EXISTS: StatusCodes.CONFLICT,
  USER_CREATION_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
  USER_FETCH_FAILED: StatusCodes.NOT_FOUND,
  USER_NOT_FOUND: StatusCodes.NOT_FOUND,

  // General Status Codes
  GENERAL_VALIDATION_FAILED: StatusCodes.BAD_REQUEST,
  GENERAL_RESOURCE_NOT_FOUND: StatusCodes.NOT_FOUND,
  GENERAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
  INVALID_DATE_FORMAT: StatusCodes.BAD_REQUEST,
  OVERBOOKING_NOT_ALLOWED: StatusCodes.CONFLICT,
} as const;

// Default error details
export const errorDetails = {
  UNKNOWN_ERROR: "Unknown Error",
  OVERBOOKING_NOT_ALLOWED:
    "Not enough seats available. There is a limit of 4 people per table.",
  RESERVATION_NOT_FOUND: "Reservation not found",
  // Users
  USER_NOT_FOUND: "User not found in the list.",
  USER_EMAIL_ALREADY_EXISTS: "This email is already registered.",
};

export type ErrorStatusCodesType =
  (typeof ErrorStatusCodes)[keyof typeof ErrorStatusCodes];
export type ErrorMessagesType =
  (typeof ErrorMessages)[keyof typeof ErrorMessages];
