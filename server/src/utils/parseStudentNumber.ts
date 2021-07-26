import { Request } from "express";

export default (req: Request): string => {
  if (typeof req.headers.hypersonstudentid === "string") {
    return req.headers.hypersonstudentid;
  }
};
