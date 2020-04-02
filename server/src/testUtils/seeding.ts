import { database as users } from "./mockUsers";
import { getCustomRepository, getConnection } from "typeorm";
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

  router.get("/reset", async (req: Request, res: Response) => {
    // These must be ordered because the database does not have cascades in place...
    // eslint-disable-next-line prettier/prettier
    const tableNames = [
      "workingTimes",
      "answerChoice",
      "answer",
      "questionChoice",
      "question",
      "registration",
      "groupStudents",
      "group",
      "course",
      "user",
    ];

    tableNames.forEach(async tableName => {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(tableName)
        .execute();
    });

    res.send("OK");
  });
};
