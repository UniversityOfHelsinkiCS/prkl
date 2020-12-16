import { getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import userData from "../../data/users";
import demoUserData from "../../data/demoUsers";
import { User } from "../entities/User";
import { UserInput } from "../inputs/UserInput";
import courseData from "../../data/courses";
import demoCourseData from "../../data/demoCourses";
import { Course } from "../entities/Course";
import { CourseInput } from "../inputs/CourseInput";

/**
 * Seed an empty database with mock data from `../../data`.
 */
const seed = async (): Promise<void> => {
  console.log(userData);
  const userRepo = getRepository(User);
  const users = userData.map(user => userRepo.create(plainToClass(UserInput, user)));
  await userRepo.save(users);

  const courseRepo = getRepository(Course);
  const courses = courseData.map(course => courseRepo.create(plainToClass(CourseInput, course)));
  await courseRepo.save(courses);
};

// Seed an empty database with demo mock data.
const demoseed = async (): Promise<void> => {
  const userRepo = getRepository(User);
  const demoUsers = demoUserData.map(demoUser => userRepo.create(plainToClass(UserInput, demoUser)));
  await userRepo.save(demoUsers);

  const courseRepo = getRepository(Course);
  const demoCourses = demoCourseData.map(demoCourse => courseRepo.create(plainToClass(CourseInput, demoCourse)));
  await courseRepo.save(demoCourses);
};

/**
 * Empty the database.
 */
const reset = async (): Promise<void> => {
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

  for (const tableName of tableNames) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(tableName)
      .execute();
  }
};

/**
 * Routes to seed the database with mock data.
 */
export default (router): void => {
  // Make sure these routes are not mounted in production, very important!
  if (process.env.NODE_ENV === "production") {
    throw new Error("Testing routes must NOT be used in production!");
  }

  router.get("/reset", async (req: Request, res: Response) => {
    try {
      await reset();
    } catch (error) {
      res.status(500).send(error);
    }

    res.send("OK");
  });

  router.get("/seed", async (req: Request, res: Response) => {
		try {
      await reset();
      await seed();
    } catch (error) {
      res.status(500).send(error);
    }

    res.send("OK");
  });

  router.get("/demoseed", async (req: Request, res: Response) => {
    try {
      await reset();
      await demoseed();
    } catch (error) {
      res.status(500).send(error);
    }

    res.send("OK");
  });
};
