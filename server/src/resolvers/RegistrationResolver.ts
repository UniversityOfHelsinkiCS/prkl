import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Registration } from "../entities/Registration";
import { RegistrationInput } from "../inputs/RegistrationInput";
import { ADMIN, STAFF } from "../utils/userRoles";
import { Course } from "../entities/Course";
import { User } from "../entities/User";

@Resolver()
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

    const registration = await Registration.findOne({ where: { studentId, courseId }, relations: ["student", "student.groups", "course"] });
    if (!registration) throw new Error("Registration not found!");

    // If the user has been assigned to a group on this course, unassign them
    const groups = await registration.student.groups.filter(g => g.courseId !== courseId);
    const unregisteredUser = await User.findOne({ id: studentId });
    unregisteredUser.groups = groups;
    await unregisteredUser.save();

    await registration.remove();

    return true;
  }
}
