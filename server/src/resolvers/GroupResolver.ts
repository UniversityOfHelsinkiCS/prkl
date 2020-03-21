import { Course } from "./../entities/Course";
import { GroupListInput } from "./../inputs/GroupListInput";
import { Resolver, Mutation, Arg, Authorized } from "type-graphql";
import { Group } from "../entities/Group";
import { STAFF } from "../utils/userRoles";
import { User } from "../entities/User";

@Resolver()
export class GroupResolver {
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
