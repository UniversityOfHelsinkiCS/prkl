import { headers } from "./mockUsers";

let user = null;

export const switchUser = (router): void => {
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

export const getActiveMockUser = () => user;
