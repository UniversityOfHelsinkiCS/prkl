/**
 * Middleware to handle Shibboleth headers.
 * Fixes the payload charset to UTF-8 and improves semantics by assigning
 * better names to fields.
 */
import { Response, Request, NextFunction } from "express";
import mockHeaders from "../utils/mockHeaders";

// Shibboleth header keys mapped to better names.
const nameMap = [
  { oldKey: "uid", newKey: "uid" },
  { oldKey: "givenname", newKey: "firstname" },
  { oldKey: "mail", newKey: "email" },
  { oldKey: "schacpersonaluniquecode", newKey: "studentNo" },
  { oldKey: "sn", newKey: "lastname" },
];

export default (req: Request, res: Response, next: NextFunction): void => {
  nameMap.forEach(({ oldKey, newKey }) => {
    if (process.env.NODE_ENV === "development") {
      mockHeaders(req);
    }

    if (req.headers[oldKey]) {
      const cache = req.headers[oldKey] as string;
      req.headers[oldKey] = null;
      req.headers[newKey] = Buffer.from(cache, "latin1").toString("utf8");
    }
  });

  next();
};
