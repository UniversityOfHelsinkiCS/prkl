import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import userData from "../../data/users";
import { User } from "../entities/User";
import { UserInput } from "../inputs/UserInput";
import courseData from "../../data/courses.js";
import { Course } from "../entities/Course";
import { CourseInput } from "../inputs/CourseInput";

/**
 * Seed an empty database with mock data from `../../data`.
 */
const seed = async (): Promise<void> => {
  const userRepo = getRepository(User);
  const users = userData.map(user => userRepo.create(plainToClass(UserInput, user)));
  await userRepo.save(users);

  const courseRepo = getRepository(Course);
  const courses = courseData.map(course => courseRepo.create(plainToClass(CourseInput, course)));
  await courseRepo.save(courses);
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
