import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
import { Registration } from "../entities/Registration";
import { GroupListInput } from "../inputs/GroupListInput";
import { STAFF, ADMIN } from "../utils/userRoles";
import { formGroupsByMultiple, formGroupsByWorkingTime } from "../algorithm/algorithm"; // new new algorithm
import { combinedAlgo } from "../algorithm/algorithm";
//import { formGroups } from "../algorithm/index"; old algorithm
import { Course } from "../entities/Course";
import { Algorithm } from "../algorithm/algorithm";

const formNewGroups = async (algorithm: Algorithm, courseId: string, minGroupSize: number) => {
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
  return algorithm(minGroupSize, registrations);
};

@Resolver()
export class GroupResolver {
  @Authorized(STAFF)
  @Query(() => [Group])
  async courseGroups(@Ctx() context, @Arg("courseId") courseId: string): Promise<Group[]> {
    const { user } = context;
    const course = await Course.findOne({ where: { id: courseId }, relations: ["teachers"] });

    if (user.role === ADMIN || course.teachers.find(t => t.id === user.id) !== undefined) {
      const groups = await Group.find({
        where: { courseId: courseId },
        relations: ["students"],
      });
      groups.forEach(g => {
        if (g.groupMessage === null) {
          g.groupMessage = '';
        }
        if (g.groupName === null) {
          g.groupName = '';
        }
      })
      return groups;
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

    const groups = data.groups && data.groups.length > 0 ? data.groups : await formNewGroups(combinedAlgo, courseId, minGroupSize);

    return Promise.all(
      groups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students });
      }),
    );
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async createSampleGroupsByMultiple(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, minGroupSize } = data;

    const groups = data.groups && data.groups.length > 0 ? data.groups : await formNewGroups(formGroupsByMultiple, courseId, minGroupSize);

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
    const groupsInDb = await Group.find({ where: { courseId: courseId } });

    const newGroups = groups.filter(g => !groupsInDb.some(gid => gid.id === g.id));

    groupsInDb.forEach(async g => {
      if (!groups.map(dg => dg.id).some(id => id === g.id)) {
        g.remove();
      } else {
        const updatedGroup = groups.find(gr => gr.id === g.id);
        g.groupName = updatedGroup.groupName;
        g.groupMessage = updatedGroup.groupMessage;
        const newStudents = await User.findByIds(updatedGroup.userIds);
        g.students = newStudents;
        g.save();
      }
    });

    return Promise.all(
      newGroups.map(async g => {
        const students = await User.findByIds(g.userIds);
        const groupMessage = g.groupMessage;
        const groupName = g.groupName;
        return Group.create({ groupName, courseId, students, groupMessage }).save();
      })
    );
  }
}
