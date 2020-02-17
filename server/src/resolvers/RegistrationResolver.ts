import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { Registration } from "../entities/Registration";
import { RegistrationInput } from "../inputs/RegistrationInput";

@Resolver()
export class RegistrationResolver {
  @Query(() => [Registration])
  registrations() {
    return Registration.find({ relations: ["course"] });
  }

  @Query(() => Registration)
  registration(@Arg("id") id: string) {
    return Registration.findOne({ where: { id }, relations: ["course"] });
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
