import { Resolver, Query, Arg, Ctx, Authorized } from "type-graphql";
import { User } from "../entities/User";
import { STAFF } from "../utils/userRoles";

@Resolver()
export class UserResolver {
  @Query(() => User)
  currentUser(@Ctx() context): Promise<User> {
    return User.findOne({
      where: { shibbolethUid: context.user.shibbolethUid },
      relations: ["registrations", "registrations.course"],
    });
  }
}
