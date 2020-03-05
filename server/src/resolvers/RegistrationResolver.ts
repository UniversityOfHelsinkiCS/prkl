import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from "type-graphql";
import { Registration } from "../entities/Registration";
import { RegistrationInput } from "../inputs/RegistrationInput";
import { STAFF } from "../utils/userRoles";

@Resolver()
export class RegistrationResolver {
  @Authorized(STAFF)
  @Query(() => [Registration])
  courseRegistrations(@Arg("courseId") courseId: string) {
    return Registration.find({
      where: { courseId: courseId },
      relations: [
        "student",
        "student.registrations",
        "questionAnswers",
        "questionAnswers.question",
        "questionAnswers.answerChoices",
        "questionAnswers.question.questionChoices",
      ],
    });
  }

  @Mutation(() => Registration)
  async createRegistration(@Ctx() context, @Arg("data") data: RegistrationInput) {
    const registration = Registration.create(data);
    registration.student = context.user;

    await registration.save();
    console.log(registration);

    return registration;
  }
}
