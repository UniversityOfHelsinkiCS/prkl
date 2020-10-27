import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { getRepository } from "typeorm";

import { Group } from "../entities/Group";
import { User } from "../entities/User";
import { UserInput } from '../inputs/UserInput';
import { Registration } from "../entities/Registration";
import { GroupListInput } from "./../inputs/GroupListInput";

import { STAFF } from "../utils/userRoles";
import { formGroups } from "../algorithm/index";

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

  @Query(() => [Group])
  async groupTimes(@Arg("studentId") studentId: string): Promise<Group[]> {
    return getRepository(Group)
      .createQueryBuilder("group")
      .innerJoinAndSelect("group.students", "student")
      .innerJoinAndSelect("student.registrations", "registration")
      .innerJoinAndSelect("registration.workingTimes", "times")
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select("group.id")
          .from(Group, "group")
          .innerJoin("group.students", "student")
          .where("student.id = :studentId")
          .getQuery();
        return "group.id IN " + subQuery;
      })
      .setParameter("studentId", studentId)
      .andWhere("registration.courseId = group.courseId")
      .getMany();
  }

  // Returns sample groups based on received data, does not save them
  @Authorized(STAFF)
  @Mutation(() => [Group])
  async createSampleGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, minGroupSize } = data;

    const groups = data.groups && data.groups.length > 0 ? data.groups : await formNewGroups(courseId, minGroupSize);

    return Promise.all(
      groups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students });
      }),
    );
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async saveGeneratedGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, groups } = data;
    (await Group.find({ where: { courseId: courseId } })).forEach(g => g.remove());

    return Promise.all(
      groups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students }).save();
      })
    );
  }
}
