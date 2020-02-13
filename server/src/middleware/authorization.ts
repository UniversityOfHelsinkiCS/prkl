import { UserRepository } from "./../repositories/UserRepository";
import { Response, Request, NextFunction } from "express";
import { User } from "./../entity/User";
import { getCustomRepository } from "typeorm";

/**
 * Check that user details match.
 * @param user User object from db.
 * @param data Shibboleth data to compare with.
 */
const userDetailsMatch = (user: User, data: object): boolean => {
  const keys = ["firstname", "lastname", "studentNo", "email"];
  return keys.every(key => user[key] === data[key]);
};

/**
 * Verify that the user always has an account (as we currently only
 * accept authenticated traffic through Shibboleth), create one if necessary,
 * synchronize user details between Shibboleth and our database, and
 * include user information for backend in the Request object.
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { uid, firstname, lastname, studentNo, email } = req.headers;
  const repo = getCustomRepository(UserRepository);

  if (typeof uid !== "string") {
    throw new TypeError("Failed header type check.");
  }

  const data = { firstname, lastname, studentNo, email, shibbolethUid: uid };
  let user = await repo.findByShibbolethUid(uid);

  // Create a new user with basic roles if none exists.
  if (!user) {
    user = await repo.addUser({ role: 1, ...data });
  }

  // Update db with new user details, if they have changed.
  if (!userDetailsMatch(user, data)) {
    user = await repo.updateUser(user.id, data);
  }

  // Make User object available to backend.
  req["user"] = user;

  next();
};
