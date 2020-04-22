import { Response, Request, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { AuthChecker } from "type-graphql";
import { UserRepository } from "./../repositories/UserRepository";
import { User } from "./../entities/User";

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

  // Don't pollute database with default headers. Also effectively denies access if Shibboleth fails.
  if (uid === "default" && process.env.NODE_ENV !== "production") {
    req["user"] = null;
    return next();
  }

  const repo = getCustomRepository(UserRepository);
  const data = { firstname, lastname, studentNo, email, shibbolethUid: uid };
  let user = await repo.findByShibbolethUid(String(uid));

  // Create a new user with basic roles if none exists.
  if (!user) {
    const role = process.env.NODE_ENV === "production" ? 1 : req.headers.role || 1;
    try {
      user = await repo.addUser({ role, ...data });
    } catch (error) {
      // FIXME: This is a hack to make mocking work.
      user = await repo.findByShibbolethUid(String(uid));
    }
  }

  // Update db with new user details, if they have changed.
  if (!userDetailsMatch(user, data)) {
    user = await repo.updateUser(user.id, data);
  }

  // Make User object available to backend.
  req["user"] = user;

  next();
};

/** Custom authChecker function for type-graphql. */
export const authChecker: AuthChecker = ({ context }, roles) => {
  const user: User = context["user"];
  const minRole = Math.min.apply(null, roles);
  return user.role >= minRole;
};
