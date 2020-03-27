import { database as users } from "./mockUsers";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import { Request, Response } from "express";

export default (router): void => {
  router.get("/seed", async (req: Request, res: Response) => {
    const repo = getCustomRepository(UserRepository);
    users.forEach(async user => repo.addUser(user));
    res.status(201).json(users);
  });
};
