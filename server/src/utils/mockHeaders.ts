/**
 * Apply mock headers from .mockheadersrc config file.
 * No-op outside local development.
 *
 * See the `defaultHeaders` object for the correct keys to use in the .rc file.
 */
import { Request } from "express";
import rc from "rc";
import { getActiveMockUser } from "../testUtils/switchUser";

const defaultHeaders = {
  uid: "123",
  givenname: "Firstname",
  mail: "default@email",
  schacpersonaluniquecode: "urn:schac:personalUniqueCode:int:studentID:helsinki.fi:011110002",
  sn: "Lastname",
};

export default (req: Request): void => {
  const headers = getActiveMockUser() ? getActiveMockUser() : rc("mockheaders", defaultHeaders);
  console.log("headers", headers);
  Object.keys(headers).forEach(key => (req.headers[key] = headers[key]));
};
