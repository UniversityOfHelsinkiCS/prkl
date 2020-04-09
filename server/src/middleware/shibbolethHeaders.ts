/**
 * Middleware to handle Shibboleth headers.
 * Fixes the payload charset to UTF-8 and improves semantics by assigning
 * better names to fields.
 */
import { Response, Request, NextFunction } from "express";

// Shibboleth header keys mapped to better names.
const nameMap = [
  { oldKey: "uid", newKey: "uid" },
  { oldKey: "givenname", newKey: "firstname" },
  { oldKey: "mail", newKey: "email" },
  { oldKey: "schacpersonaluniquecode", newKey: "studentNo" },
  { oldKey: "sn", newKey: "lastname" },
];

const defaultHeaders = {
  uid: "default",
  givenname: "Default Firstname",
  mail: "default@email",
  schacpersonaluniquecode: "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:011110002",
  sn: "Default Lastname",
};

const allHeadersExist = req => {
  const keys = nameMap.map(name => name.oldKey);
  return keys.every(key => !!req.headers[key]);
};

/**
 * Handle Shibboleth headers.
 * Applies default headers, if complete set of headers not received. Renames Shibboleth headers
 * for improved semantics. Attempts to parse student number from Shibboleth's code.
 */
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!allHeadersExist(req) && process.env.NODE_ENV !== "production") {
    Object.keys(defaultHeaders).forEach(key => (req.headers[key] = defaultHeaders[key]));
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
