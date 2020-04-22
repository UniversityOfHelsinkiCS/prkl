import { GroupListInput } from "./../inputs/GroupListInput";
import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { Group } from "../entities/Group";
import { STAFF } from "../utils/userRoles";
import { User } from "../entities/User";
import { formGroups } from "../algorithm/index";
import { Registration } from "../entities/Registration";
import { WorkingTimes } from "../entities/WorkingTimes";
import { getRepository } from "typeorm";

const formNewGroups = async (courseId: string, minGroupSize: number) => {
  const registrations = await Registration.find({
    where: { courseId: courseId },
    relations: [
      "student",
      "questionAnswers",
      "questionAnswers.question",
      "questionAnswers.answerChoices",
      "questionAnswers.question.questionChoices",
      "workingTimes",
    ],
  });
  return formGroups(minGroupSize, registrations);
};

@Resolver()
export class GroupResolver {
  @Authorized(STAFF)
  @Query(() => [Group])
  courseGroups(@Arg("courseId") courseId: string): Promise<Group[]> {
    return Group.find({
      where: { courseId: courseId },
      relations: ["students"],
    });
  }

  @Query(() => [WorkingTimes])
  async groupTimes(@Arg("groupId") groupId: string, @Arg("courseId") courseId: string): Promise<WorkingTimes[]> {
    return await getRepository(WorkingTimes)
      .createQueryBuilder("times")
      .innerJoinAndSelect("times.registration", "registration")
      .innerJoin("registration.student", "student")
      .innerJoin("student.groups", "group")
      .where("group.id = :groupId", { groupId: groupId })
      .andWhere("registration.courseId = :courseId", { courseId: courseId })
      .getMany();
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async createGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, minGroupSize } = data;
    (await Group.find({ where: { courseId: courseId } })).forEach(g => g.remove());

    const groups = data.groups && data.groups.length > 0 ? data.groups : await formNewGroups(courseId, minGroupSize);

    return await Promise.all(
      groups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students }).save();
      }),
    );
  }
}
