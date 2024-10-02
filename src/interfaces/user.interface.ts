import * as TE from "fp-ts/TaskEither";
import { AppError } from "../types/error.types";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UserService {
  registerUser(data: CreateUserInput): TE.TaskEither<AppError, User>;
  getAllUsers(): TE.TaskEither<AppError, User[]>;
}

export interface UserRepository {
  createUser(data: CreateUserInput): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findAllUsers(): Promise<User[]>;
}
