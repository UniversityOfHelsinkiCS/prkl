import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
import { Registration } from "../entities/Registration";
import { GroupListInput } from "./../inputs/GroupListInput";
import { STAFF, ADMIN } from "../utils/userRoles";
import { formGroups } from "../algorithm/index";
import { Course } from "../entities/Course";

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
  async courseGroups(@Ctx() context, @Arg("courseId") courseId: string): Promise<Group[]> {
    const { user } = context;
    const course = await Course.findOne({ where: { id: courseId }, relations: ["teachers"] });
    
    if (user.role === ADMIN || course.teachers.find(t => t.id === user.id) !== undefined) {
      return Group.find({
        where: { courseId: courseId },
        relations: ["students"],
      });
    }
    throw new Error("Not your course.");
  }

  // Is there need for an authorization? Or would it mess group view for students?
  @Query(() => [Group])
  async groupTimes(@Arg("studentId") studentId: string): Promise<Group[]> {
    return getRepository(Group)
      .createQueryBuilder("group")
      .select(['group', 'student.id', 'student.firstname', 'registration', 'times'])
      .innerJoin("group.students", "student")
      .innerJoin("student.registrations", "registration")
      .innerJoin("registration.workingTimes", "times")
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
