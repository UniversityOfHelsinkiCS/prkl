import { Resolver, Query, Mutation, Arg, Ctx, Authorized, UnauthorizedError } from "type-graphql";
import { Registration } from "../entities/Registration";
import { RegistrationInput } from "../inputs/RegistrationInput";
import { USER, STAFF, ADMIN } from "../utils/userRoles";

import { Course } from "../entities/Course";@Resolver()
export class RegistrationResolver {
  @Authorized(STAFF)
  @Query(() => [Registration])
  async courseRegistrations(@Ctx() context, @Arg("courseId") courseId: string): Promise<Registration[]> {
    const { user } = context;
    const course = await Course.findOne({ where: { id: courseId }, relations: ["teachers"] });

    if (user.role === ADMIN || course.teachers.find(t => t.id === user.id) !== undefined) {
      return Registration.find({
        where: { courseId: courseId },
        relations: [
          "student",
          "questionAnswers",
          "questionAnswers.question",
          "questionAnswers.answerChoices",
          "questionAnswers.question.questionChoices",
          "workingTimes",
        ],
      });
    } 
    throw new Error("Not your course.");
  }

  @Mutation(() => Registration)
  async createRegistration(@Ctx() context, @Arg("data") data: RegistrationInput): Promise<Registration> {
    const course = await Course.findOne({ where: { id: data.courseId } });

    if (course.deadline < new Date()) {
      throw new Error("The deadline for registrations has passed.");
    }

    const registration = Registration.create(data);
    registration.student = context.user;

    await registration.save();

    return registration;
  }

  @Mutation(() => Boolean)
  async deleteRegistration(@Ctx() context, @Arg("studentId") studentId: string, @Arg("courseId") courseId: string): Promise<boolean> {
    const { user } = context;
    let auth = false;

    const course = await Course.findOne({
      where: { id: courseId },
      relations: ["teachers"],
    });

    if (studentId === user.id && course.deadline > new Date()) {
      auth = true;
    } else if (user.role === STAFF && course.teachers.find(t => t.id === user.id) !== undefined) {
      auth = true;
    } else if (user.role === ADMIN) {
      auth = true;
    };
    if (!auth) throw new Error("You are not authorized to cancel his registration or deadline has passed.");
    
    const registration = await Registration.findOne({ where: { studentId, courseId }, relations: ["student", "course"] });
    if (!registration) throw new Error("Registration not found!");

    await registration.remove();

    return true;
  }
}
