import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { CreateUserInput } from "../inputs/CreateUserInput";

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Arg("id") id: string) {
    return User.findOne({ where: { id } });
  }
  @Query(() => User)
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput, _, @Ctx() context) {
    data = { ...data, shibbolethID: "shibbID" };
    const user = User.create(data);
    console.log("context:", context);
    console.log("_:", _);

    console.log("course:", user);

    await user.save();

    return user;
  }

  // @Mutation(() => Boolean)
  // async deleteCourse(@Arg("id") id: string) {
  //   const course = await User.findOne({ where: { id } });
  //   if (!course) throw new Error("Course not found!");
  //   await course.remove();
  //   return true;
  // }
}
