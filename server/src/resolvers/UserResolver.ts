import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { ADMIN, STAFF } from "../utils/userRoles";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async currentUser(@Ctx() context): Promise<User> {
    const user = await User.findOne({
      where: { shibbolethUid: context.user.shibbolethUid },
      relations: ["registrations", "registrations.course", "groups", "groups.students", "groups.course"],
    });

    // Should we also hide unpublished groups from staff members?
    if (user.role < STAFF) {
      user.groups = user.groups.filter(g => g.course.groupsPublished);
    }

    if (user.role < ADMIN) {
      user.groups.map(g => {
        g.students.map(s => {
          (s.studentNo = null), (s.shibbolethUid = null);
        });
      });
    }

    // Resolve migration issue where each course had groupPublished field set to null, which effed up everything
    user.groups.forEach(g => {
      if (g.groupMessage === null) {
        g.groupMessage = "";
      }

      if (g.groupName === null) {
        g.groupName = "";
      }
    });

    return user;
  }

  @Authorized(ADMIN)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find({});
  }

  @Authorized(STAFF)
  @Query(() => [User])
  async facultyUsers(@Ctx() context): Promise<User[]> {
    const { user } = context;
    const users = await User.find({ where: [{ role: 2 }, { role: 3 }] });

    if (user.role < ADMIN) {
      users.map(u => {
        (u.studentNo = null), (u.shibbolethUid = null);
      });
    }

    return users;
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
