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
    console.log(`givenname is: ${req.headers.givenname}`);

    if (req.headers[oldKey]) {
      req.headers[newKey] = Buffer.from(req.headers[oldKey] as string, "latin1").toString("utf8");

      req.headers[oldKey] = null;
    }
    console.log(`firstname is: ${req.headers.firstname}`);
  });

  next();
};
