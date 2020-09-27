import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Registration } from "../entities/Registration";
import { RegistrationInput } from "../inputs/RegistrationInput";
import { USER, STAFF, ADMIN } from "../utils/userRoles";
import { Course } from "../entities/Course";

@Resolver()
export class RegistrationResolver {
  @Authorized(STAFF)
  @Query(() => [Registration])
  courseRegistrations(@Arg("courseId") courseId: string): Promise<Registration[]> {
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

  @Query(() => Registration)
  async registration(@Ctx() context, @Arg("studentId") studentId: string, @Arg("courseId") courseId: string): Promise<Registration> {
    const { user } = context;
    let registration;
    let auth = false;
    
    console.log('courseId in query: ', courseId);
    console.log('studentId in query: ', studentId);

    if (studentId === user.id) {
      auth = true;
    } else if (user.role === STAFF) {
      const course = await Course.findOne({
        where: { id: courseId },
        relations: ["teacher"],
      });

      if ( course.teacher.id === user.id){
        auth = true;
      }
    } else if (user.role === ADMIN) {
      auth = true;
    }

    if (!auth) throw new Error("Not authorized.");
    
    registration = await Registration.findOne({ where: { studentId, courseId }, relations: ["student", "course"] });
    if (!registration) throw new Error("Registration not found!");
    return registration;
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
  async deleteRegistration(@Ctx() context, @Arg("id") id: string): Promise<boolean> {
    const registration = await Registration.findOne({ where: { id } });
    if (!registration) throw new Error("Registration not found!");

    const course = await Course.findOne({
      where: { id: registration.courseId },
      relations: ["teacher"],
    });

    if (context.user.role === ADMIN) {
      await registration.remove();
    } else if (context.user.role === STAFF && course.teacher.id === context.user.id) {
      await registration.remove();
    } else if (context.user.role === USER && registration.studentId === context.user.id) {
      await registration.remove();
    } else {
      throw new Error("No authority.");
    }

    return true;
  }
}
