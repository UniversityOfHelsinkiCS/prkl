import { Course } from "./../entities/Course";
import { GroupListInput } from "./../inputs/GroupListInput";
import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { Group } from "../entities/Group";
import { GroupInput } from "../inputs/GroupInput";
import { STAFF } from "../utils/userRoles";
import { User } from "../entities/User";

@Resolver()
export class GroupResolver {
  // FIXME: remove or make safe
  @Query(() => Group)
  group(@Arg("id") id: string) {
    return Group.findOne({ where: { id } });
  }
  // FIXME: remove or make safe
  @Query(() => [Group])
  groups() {
    return Group.find({ relations: ["students"] });
  }

  @Authorized(STAFF)
  @Mutation(() => Group)
  async createGroup(@Arg("data") data: GroupInput) {
    const group = Group.create(data);
    await group.save();

    return group;
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async createGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, groups } = data;
    (await Group.find({ where: { course: { id: courseId } } })).forEach(g => g.remove());

    const course = await Course.findOne({ id: courseId });

    groups.forEach(async g => {
      const students = await User.findByIds(g.userIds);
      Group.create({ course, students }).save();
    });

    return Group.find({ where: { course: { id: courseId } } });
  }
}
