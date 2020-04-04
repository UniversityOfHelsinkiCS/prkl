import { Resolver, Query, Arg, Ctx, Authorized, Mutation } from "type-graphql";
import { User } from "../entities/User";
import { ADMIN } from "../utils/userRoles";

@Resolver()
export class UserResolver {
  @Query(() => User)
  currentUser(@Ctx() context): Promise<User> {
    return User.findOne({
      where: { shibbolethUid: context.user.shibbolethUid },
      relations: ["registrations", "registrations.course", "groups", "groups.students", "groups.course"],
    });
  }

  @Authorized(ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({});
  }

  @Authorized(ADMIN)
  @Mutation(() => User)
  async editUserRole(@Arg("id") id: string, @Arg("role") role: number): Promise<User> {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }
    user.role = role;
    await user.save();
    return user;
  }
}
