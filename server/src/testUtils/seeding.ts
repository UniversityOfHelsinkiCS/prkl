import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import userData from "../../data/users.js";
import { User } from "../entities/User";
import { plainToClass } from "class-transformer";
import { UserInput } from "../inputs/UserInput";

/**
 * Seed an empty database with mock data from `../../data`.
 */
const seed = async (): Promise<void> => {
  const repo = getRepository(User);
  const users = userData.map(user => repo.create(plainToClass(UserInput, user)));
  await repo.save(users);
};

/**
 * Routes to seed the database with mock data.
 */
export default (router): void => {
  // Make sure these routes are not mounted in production.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Testing routes must NOT be used in production!");
  }

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
      try {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(tableName)
          .execute();
      } catch (error) {
        res.status(500).send(error);
      }
    });

    res.send("OK");
  });

  router.get("/seed", async (req: Request, res: Response) => {
    try {
      await seed();
    } catch (error) {
      res.status(500).send(error);
    }

    res.send("OK");
  });
};
