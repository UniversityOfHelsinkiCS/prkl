/**
 * Apply mock headers from .mockheadersrc config file.
 * No-op outside local development.
 *
 * See the `defaultHeaders` object for the correct keys to use in the .rc file.
 */
import { Request } from "express";
import rc from "rc";

const defaultHeaders = {
  uid: "123",
  givenname: "Firstname",
  mail: "default@email",
  schacpersonaluniquecode: "12345678",
  sn: "Lastname",
};

export default (req: Request): void => {
  const config = rc("mockheaders", defaultHeaders);
  Object.keys(config).forEach(key => (req.headers[key] = config[key]));
};
