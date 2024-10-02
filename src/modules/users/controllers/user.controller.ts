import { Request, Response, NextFunction } from "express";
import {
  UserService,
  CreateUserInput,
} from "../../../interfaces/user.interface";
import { handleResponse } from "../../../shared/helpers/response.helper";

export const createUserController =
  (userService: UserService) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData: CreateUserInput = req.body;
    return handleResponse(
      req,
      res,
      userService.registerUser(userData),
      201
    ).catch(next);
  };

export const getUsersController =
  (userService: UserService) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return handleResponse(req, res, userService.getAllUsers(), 200).catch(next);
  };
