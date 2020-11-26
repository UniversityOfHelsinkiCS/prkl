import { Response, Request, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { AuthChecker } from "type-graphql";
import { UserRepository } from "./../repositories/UserRepository";
import { User } from "./../entities/User";
import parseStudentNumber from "../utils/parseStudentNumber";

export type AuthenticatedRequest = Request & { user: User };

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
  console.log('\n\n\n\nNEW REQUEST CAME IN')
  console.log('in authorization mw, req.headers is:')
  console.log(req.headers)
  if (process.env.NODE_ENV !== "production") {
    console.log(`authorization was skipped, NODE_ENV is '${process.env.NODE_ENV}'`)
    return next();
  }
  console.log(`authorization was not skipped, NODE_ENV is '${process.env.NODE_ENV}'`)

  const { uid, givenname: firstname, sn: lastname, mail: email } = req.headers;

  const repo = getCustomRepository(UserRepository);
  const data = { firstname, lastname, studentNo: parseStudentNumber(req), email, shibbolethUid: uid };
  let user = await repo.findByShibbolethUid(String(uid));

  // Create a new user with basic roles if none exists.
  if (!user) {
    try {
      user = await repo.addUser({ role: 1, ...data });
    } catch (error) {
      // FIXME: This is a hack to make mocking work.
      //user = await repo.findByShibbolethUid(String(uid));
      console.log("Creating new user failed", error);
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
