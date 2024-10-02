import prisma from "../../../utils/prisma";
import { User } from "@prisma/client";
import {
  CreateUserInput,
  UserRepository,
} from "../../../interfaces/user.interface";

export const createUser: UserRepository["createUser"] = async (
  data: CreateUserInput
): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const findUserByEmail: UserRepository["findUserByEmail"] = async (
  email: string
): Promise<User | null> => {
  return prisma.user.findUnique({ where: { email } });
};

export const findAllUsers: UserRepository["findAllUsers"] = async (): Promise<
  User[]
> => {
  return prisma.user.findMany();
};
