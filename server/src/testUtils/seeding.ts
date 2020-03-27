import { database as users } from "./mockUsers";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { Request, Response } from "express";

/**
 * Route to seed the database with mock users.
 */
export default (router): void => {
  router.get("/seed", async (req: Request, res: Response) => {
    const repo = getCustomRepository(UserRepository);
    users.forEach(async user => repo.addUser(user));
    res.status(201).json(users);
  });
};
