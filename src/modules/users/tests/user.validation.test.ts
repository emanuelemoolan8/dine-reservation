import { Request, Response, NextFunction } from "express";
import * as E from "fp-ts/Either";
import { ValidationError } from "io-ts";
import { handleAppError } from "../../../middleware/handlers/errorHandler";
import { UserCodec } from "../../../types/user.types";
import { validateUser } from "../../../middleware/validations/userValidation";

jest.mock("../../../middleware/handlers/errorHandler");

describe("validateUser Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if validation passes", () => {
    const validUser = { name: "John", email: "john@example.com" };
    req.body = validUser;

    jest.spyOn(UserCodec, "decode").mockReturnValue(E.right(validUser));

    validateUser(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should handle validation errors if validation fails", () => {
    const validationErrors: ValidationError[] = [
      { value: "invalid-email", context: [], message: "Invalid email" },
    ];

    jest.spyOn(UserCodec, "decode").mockReturnValue(E.left(validationErrors));

    validateUser(req as Request, res as Response, next);

    expect(handleAppError).toHaveBeenCalled();
    expect(handleAppError).toHaveBeenCalledWith(
      expect.objectContaining({
        details: expect.stringContaining("Invalid email"),
      }),
      req,
      res
    );
  });
});
