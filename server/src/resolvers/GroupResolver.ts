import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { getRepository } from "typeorm";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
import { Registration } from "../entities/Registration";
import { GroupListInput } from "../inputs/GroupListInput";
import { STAFF, ADMIN } from "../utils/userRoles";
import { formGroups, findGroupForGrouplessStudents, Grouping, Group as regArray } from "../algorithm/algorithm";
//import { formGroups } from "../algorithm/index"; old algorithm
import { Course } from "../entities/Course";
import { Algorithm } from "../algorithm/algorithm";
import { GroupInput } from "../inputs/GroupInput";
import { group } from "console";
import { GenerateGroupsInput } from "../inputs/GenerateGroupsInput";

@Resolver()
export class GroupResolver {
  @Authorized(STAFF)
  @Query(() => [Group])
  async courseGroups(@Ctx() context, @Arg("courseId") courseId: string): Promise<Group[]> {
    const { user } = context;
    const course = await Course.findOne({ where: { id: courseId }, relations: ["teachers"] });

    if (course === undefined) {
      throw new Error("course not found with id " + courseId)
    }

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
  async createSampleGroups(@Arg("data") data: GenerateGroupsInput): Promise<Group[]> {
    if (data.registrationIds === undefined || data.registrationIds === []) {
      return Promise.resolve([])
    }
    
    let registrations: Registration[] = []
    if (data.registrationIds !== undefined) {
      registrations = await Registration.findByIds(data.registrationIds, { relations: [
        "student",
        "questionAnswers",
        "questionAnswers.question",
        "questionAnswers.answerChoices",
        "questionAnswers.question.questionChoices",
        "workingTimes",
      ],
     })
    }

    const newGroups = formGroups(data.targetGroupSize, registrations)
    
    return Promise.all(
      newGroups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId: data.courseId, students });
      })
    );
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async generateGroupsForNonLockedGroups(@Arg("data") data: GroupListInput): Promise<Group[]> {
    const { courseId, minGroupSize, groups } = data;

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

    const registrationsUsedForAlgorithm = () => {
      const returnedRegs: Registration[] = [];
      groups.map(g => {
        g.userIds.map(id => {
          registrations.map(r => {
            if (r.studentId === id) {
              returnedRegs.push(r);
            }
          })
        })
      })
      return returnedRegs
    }

    const regsForAlgo = registrationsUsedForAlgorithm();

    const newGroups = formGroups(minGroupSize, regsForAlgo);

    return Promise.all(
      newGroups.map(async g => {
        const students = await User.findByIds(g.userIds);
        return Group.create({ courseId, students });
      }),
    );
  }

  @Authorized(STAFF)
  @Mutation(() => [Group])
  async findGroupForGrouplessStudents(
      @Arg("data") data: GroupListInput,
      @Arg("groupless") groupless: GroupListInput,
      @Arg("maxGroupSize") maxGroupSize: number
    ): Promise<Group[]> {

    const { courseId, groups } = data;
    const { groups: grouplessStudents } = groupless;

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

    const groupsToGroupingType = (groups: GroupInput[], registrations: Registration[]): Grouping => {
      const grouping: Grouping = [];

      for (const group of groups) {
        const regArray: regArray = [];
        for (const userId of group.userIds) {
          for (const registration of registrations) {
            if (registration.studentId === userId) {
              regArray.push(registration);
            }
          }
        }     
        grouping.push(regArray); 
      }   
      return grouping;
    };

    const grouplessToRegistrationArray = (grouplessStudents: GroupInput[], registrations: Registration[]): Registration[] => {
      const grouplessArray: Registration[] = [];
      grouplessStudents[0].userIds.map(id => {
        grouplessArray.push(registrations.find(registration => registration.studentId === id))       
      })      
      return grouplessArray;
    }

    const grouping = groupsToGroupingType(groups, registrations);
    const grouplessStudentsAsRegistrationArray = grouplessToRegistrationArray(grouplessStudents, registrations);

    const newGroups = findGroupForGrouplessStudents(grouplessStudentsAsRegistrationArray, grouping, maxGroupSize);
    return Promise.all(
      newGroups.map(async g => {
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
