/**
 * Middleware to handle Shibboleth headers.
 * Fixes the payload charset to UTF-8 and improves semantics by assigning
 * better names to fields.
 */
import { Response, Request, NextFunction } from "express";
import { getCustomRepository } from 'typeorm';
import { getActiveMockHeaders } from "../testUtils/switchUser";
import { UserRepository } from '../repositories/UserRepository';
import { database as users } from '../testUtils/mockUsers';

// Shibboleth header keys mapped to better names.
const nameMap = [
  { oldKey: "uid", newKey: "uid" },
  { oldKey: "givenname", newKey: "firstname" },
  { oldKey: "mail", newKey: "email" },
  { oldKey: "schacpersonaluniquecode", newKey: "studentNo" },
  { oldKey: "sn", newKey: "lastname" },
];

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Apply mock headers if not running in production.
  if (process.env.NODE_ENV !== "production") {
    // FIXME: This is ugly, I'm sorry.
    // Make sure mock users exist with proper roles.
    const repo = getCustomRepository(UserRepository);
    users.forEach(async user => {
      try {
        await repo.addUser(user);
      } catch (error) {
        // Fail silently if database already populated.
      }
    });

    const headers = getActiveMockHeaders();
    Object.keys(headers).forEach(key => (req.headers[key] = headers[key]));
  }

  nameMap.forEach(({ oldKey, newKey }) => {
    if (req.headers[oldKey]) {
      const cache = req.headers[oldKey] as string;
      req.headers[oldKey] = null;
      req.headers[newKey] = Buffer.from(cache, "latin1").toString("utf8");
    }
  });

  // Attempt to parse student number from schacwhatever.
  // Expected form: urn:schac:personalUniqueCode:int:studentID:helsinki.fi:011110002
  if (typeof req.headers.studentNo === "string") {
    const parts = req.headers.studentNo.split(":");

    if (parts.length < 7 || parts[4] !== "studentID") {
      req.headers.studentNo = null;
    } else {
      req.headers.studentNo = parts[6];
    }
  }

  next();
};
