import * as t from "io-ts";
const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Email = t.refinement(
  t.string,
  (email) => EmailRegex.test(email),
  "Email"
);

export const UserCodec = t.type({
  name: t.string,
  email: Email,
});
