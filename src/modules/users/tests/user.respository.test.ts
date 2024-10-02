import { createUser, findUserByEmail } from "../repositories/user.repository";
import prisma from "../../../utils/prisma";

jest.mock("../../../utils/prisma", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe("User Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createUser({
      email: "test@example.com",
      name: "Test User",
    });

    expect(result).toEqual(mockUser);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        name: "Test User",
      },
    });
  });

  it("should find a user by email", async () => {
    const mockUser = { id: 1, email: "test@example.com", name: "Test User" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await findUserByEmail("test@example.com");

    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("should return null if user not found", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await findUserByEmail("nonexistent@example.com");

    expect(result).toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });
});
