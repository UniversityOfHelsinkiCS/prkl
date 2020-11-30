import { Request } from "express";

export default (req: Request): string => {
  // Attempt to parse student number from schacwhatever.
  // Expected form: urn:schac:personalUniqueCode:int:studentID:helsinki.fi:011110002
  if (typeof req.headers.schacpersonaluniquecode === "string") {
    const parts = req.headers.schacpersonaluniquecode.split(":");

    if (parts.length < 7 || parts[4] !== "studentID") {
      return null;
    } else {
      return parts[6];
    }
  }
};
