import * as t from "io-ts";

export const ReservationCodec = t.type({
  userId: t.number,
  tableNumber: t.number,
  numberOfSeats: t.number,
  reservationTime: t.string,
});

export const DateRangeQuery = t.type({
  start: t.string,
  end: t.string,
});
