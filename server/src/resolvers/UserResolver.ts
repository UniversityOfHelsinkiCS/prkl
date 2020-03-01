import { Resolver, Query, Arg, Ctx, Authorized } from "type-graphql";
import { User } from "../entities/User";
import { STAFF } from "../utils/userRoles";

@Resolver()
export class UserResolver {
  @Query(() => User)
  user(@Arg("id") id: string, @Ctx() context): Promise<User> {
    // FIXME: Handle this better.
    if (context.user.role < 2 && id !== context.user.id) {
      return null;
    }

    return User.findOne({ where: { id } });
  }

  @Authorized(STAFF)
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({ relations: ["registrations"] });
  }

  @Query(() => User)
  currentUser(@Ctx() context): Promise<User> {
    return User.findOne({ where: { shibbolethUid: context.user.shibbolethUid }, relations: ["registrations"] });
  }
}
