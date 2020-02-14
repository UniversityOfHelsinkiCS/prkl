import { Resolver, Query, Arg, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Arg("id") id: string): Promise<User> {
    return User.findOne({ where: { id } });
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User)
  currentUser(@Ctx() context): Promise<User> {
    return User.findOne({ where: { shibbolethUid: context.user.shibbolethUid } });
  }
}
