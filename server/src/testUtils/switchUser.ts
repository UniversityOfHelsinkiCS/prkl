import { headers } from "./mockUsers";

let user = headers[0];

export const switchUser = (router): void => {
  // Make sure these routes are not mounted in production.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Testing routes must NOT be used in production!");
  }

  /**
   * Switch to the mock user defined by the field `index` which is used as index
   * to get the user from mockUsers.headers array.
   */
  router.post("/switchUser", (req, res) => {
    const { index = 0 } = req.body;
    user = headers[index];
    res.send(user);
  });
};

export const getActiveMockHeaders = () => user;
