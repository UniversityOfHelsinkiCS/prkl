import { Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { isAdmin } from "../utils/userRoles";
import { AuthenticatedRequest } from "./authorization";

/**
 * User mocking for admins.
 */
const loggedInAs = {};

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { user } = req;
  const canMock = process.env.NODE_ENV === "development" ? true : isAdmin(user);

  if (!canMock) {
    return next();
  }

  const username = process.env.NODE_ENV === "development" ? "3" : user.shibbolethUid;

  // Set mocked user.
  const mockingHeader = req.headers["x-admin-logged-in-as"];

  if (mockingHeader) {
    loggedInAs[username] = mockingHeader;
  }

  // Overwrite req.user if mocking.
  const usernameToMock = loggedInAs[username];

  if (usernameToMock) {
    const repo = getCustomRepository(UserRepository);
    const mockedUser = await repo.findByShibbolethUid(usernameToMock);
    req.user = mockedUser;
    req["mockedBy"] = username;
  }

  next();
};
