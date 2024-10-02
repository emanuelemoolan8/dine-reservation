import { DateTime } from "luxon";
import { LOCAL_CLOSING_HOUR, LOCAL_OPENING_HOUR } from "../shared/constants";

const DEFAULT_TIMEZONE = process.env.APP_TIMEZONE || "Europe/Rome";

import { parseISO, isValid } from "date-fns";

export const isValidDate = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isValid(date);
};

export const OPENING_HOUR = DateTime.now()
  .setZone(DEFAULT_TIMEZONE)
  .set({ hour: LOCAL_OPENING_HOUR, minute: 0 })
  .toUTC().hour;
export const CLOSING_HOUR = DateTime.now()
  .setZone(DEFAULT_TIMEZONE)
  .set({ hour: LOCAL_CLOSING_HOUR, minute: 0 })
  .toUTC().hour;

export const toUTC = (time: string): string => {
  const utcTime = DateTime.fromISO(time).toUTC().toISO();

  if (!utcTime) {
    throw new Error("Invalid date format");
  }

  return utcTime;
};

export const toISOString = (time: string | Date): string => {
  return typeof time === "string" ? time : time.toISOString();
};

export const getCurrentUTC = (): string => {
  const currentTime = DateTime.utc().toISO();

  if (!currentTime) {
    throw new Error("Unable to get current UTC time");
  }

  return currentTime;
};
