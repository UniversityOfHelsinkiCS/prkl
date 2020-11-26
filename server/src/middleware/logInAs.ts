import { Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { isAdmin } from "../utils/userRoles";
import { AuthenticatedRequest } from "./authorization";

export type MockedByRequest = AuthenticatedRequest & { mockedBy: String };

/**
 * User mocking for admins.
 */
const loggedInAs = {'3': '3'};

export default async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const { user } = req;
  console.log('\nat the start of logInAs mw, user is:', user)
  console.log('and req.headers is:')
  console.log(req.headers)
  const canMock = process.env.NODE_ENV !== "production" ? true : isAdmin(user);

  if (!canMock) {
    return next();
  }

  const username = process.env.NODE_ENV !== "production" ? "3" : user.shibbolethUid;

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

  console.log('at the end of logInAs mw, req.user is', req.user)
  console.log('and req.headers are:')
  console.log(req.headers)

  next();
};
