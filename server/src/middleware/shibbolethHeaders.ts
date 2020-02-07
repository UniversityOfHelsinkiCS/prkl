/**
 * Middleware to handle Shibboleth headers.
 * Fixes the payload charset to UTF-8 and improves semantics by assigning
 * better names to fields.
 */
import { Response, Request, NextFunction } from "express";


const nameMap = [
  { oldKey: "uid", newKey: "uid" },
  { oldKey: "givenname", newKey: "firstname" },
  { oldKey: "mail", newKey: "email" },
  { oldKey: "schacpersonaluniquecode", newKey: "studentNo" },
  { oldKey: "sn", newKey: "lastname" },
];

export default (req: Request, res: Response, next: NextFunction) => {
  nameMap.forEach(({ oldKey, newKey }) => {
    if (req.headers[oldKey]) {
      req.headers[newKey] = Buffer
        .from(req.headers[oldKey] as string, "latin1")
        .toString("utf8");

      req.headers[oldKey] = null;
    }
  });
  
  next();
};
