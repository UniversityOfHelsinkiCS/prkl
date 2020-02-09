import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "../entity/User";
import { CreateUserInput } from "../inputs/CreateUserInput";

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Arg("id") id: string) {
    return User.findOne({ where: { id } });
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User)
  findByShibbolethUid(@Arg("shibbolethUid") shibbolethUid: string): Promise<User> {
    return User.findOne({ where: { shibbolethUid } });
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
    const user = User.create(data);
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
