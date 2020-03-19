import { Course } from "./../entities/Course";
import { GroupListInput } from "./../inputs/GroupListInput";
import { Resolver, Mutation, Arg, Authorized, ID } from "type-graphql";
import { Group } from "../entities/Group";
import { STAFF } from "../utils/userRoles";
import { User } from "../entities/User";
import { formGroups } from "../algorithm/index";
import { Registration } from "../entities/Registration";

const formNewGroups = async (courseId: String) => {
  const registrations = await Registration.find({ where: { courseId: courseId } });
  const course = await Course.findOne({ where: { id: courseId } });
  return formGroups(course, registrations);
};

@Resolver()
export class GroupResolver {
  @Authorized(STAFF)
  @Mutation(() => [Group])
  async createGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId } = data;
    (await Group.find({ where: { courseId: courseId } })).forEach(g => g.remove());

    const groups = data.groups ? data.groups : await formNewGroups(courseId);

    return await Promise.all(
      groups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students }).save();
      }),
    );
  }
}
