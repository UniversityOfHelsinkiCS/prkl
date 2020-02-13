import { Resolver, Query, Arg } from "type-graphql";
import { User } from "../entity/User";

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
  currentUser() {
    // TODO...
  }
}
