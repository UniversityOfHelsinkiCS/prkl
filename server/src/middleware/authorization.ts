/**
 * Authorization middleware.
 *
 * Verifies that the user always has an account (as we currently only
 * accept authenticated traffic through Shibboleth), creates one if necessary and
 * includes user information for the client in HTTP headers.
 */
import { Response, Request, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { UserResolver } from "./../resolvers/UserResolver";
import { CreateUserInput } from "../inputs/CreateUserInput";

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const uid = req.headers.uid;
  const { createUser, findByShibbolethUid } = new UserResolver();

  if (typeof uid !== "string") {
    throw new TypeError("Failed header type check.");
  }

  let user = await findByShibbolethUid(uid);

  // Create a new user with basic roles if none exists.
  if (!user) {
    const data = plainToClass(CreateUserInput, {
      shibbolethUid: uid,
      role: 1,
    });
    user = await createUser(data);
  }

  // Make User object available to backend.
  req["user"] = user;

  // Expose only our internal user id to client.
  res.set("Assembler-Uid", user.id);

  next();
};
