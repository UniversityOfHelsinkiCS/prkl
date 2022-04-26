import * as _ from "lodash";
import { workingTimeList } from "./evaluators/evaluateByWorkingHours";
import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import evaluateBoth from "./evaluators/bothEvaluators";

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[];
export type Evaluator = (group: Group) => number;
export type Group = Registration[];
export type Grouping = Group[];

export type GroupTimes = {
  id: number;
  Group: Group;
  workingTimes: Map<number, Map<number, number>>;
};

export type GrouplessStudent = {
  registration: Registration;
  commonHoursWithOtherGroups: Map<number, number>;
};

export type grouplessStudentsWorkingTimes = workingTimeList[];

const sum = (arr: number[]): number => arr.reduce((sum, val) => sum + val, 0);

const scoreBoth = (grouping: Grouping): number => {
  return sum(grouping.map(evaluateBoth));
};

// Generates random groups and makes sure that all groups are of approx. same size
const createRandomGrouping = (targetGroupSize: number, registrations: Registration[]): Registration[][] => {
  const shuffled = _.shuffle(registrations);
  const groups = _.chunk(shuffled, targetGroupSize);
  const leftOverGroup = groups[groups.length - 1];
  if (leftOverGroup.length <= groups.length && targetGroupSize - leftOverGroup.length > 1) {
    return groups.slice(0, groups.length - 1).map((group, index) => {
      if (index < leftOverGroup.length) {
        return group.concat(leftOverGroup[index]);
      } else {
        return group;
      }
    });
  }
  return groups;
};

const mutateGrouping = (grouping: Grouping): Grouping => {
  if (grouping.length < 2) {
    return grouping;
  }

  const groupsToSwapFrom = _.sampleSize(grouping, 2);
  const rest = _.without(grouping, ...groupsToSwapFrom);

  const group1User = _.sample(groupsToSwapFrom[0]);
  const group1Rest = _.without(groupsToSwapFrom[0], group1User);

  const group2User = _.sample(groupsToSwapFrom[1]);
  const group2Rest = _.without(groupsToSwapFrom[1], group2User);

  return [...rest, group2Rest.concat(group1User), group1Rest.concat(group2User)];
};

export const formGroups: Algorithm = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {
  let grouping: Group[] = createRandomGrouping(targetGroupSize, registrations);
  let score = scoreBoth(grouping);

  for (let i = 0; i < registrations.length * 20; i++) {
    const newGrouping = mutateGrouping(grouping);
    const newScore = scoreBoth(newGrouping);

    if (newScore > score) {
      score = newScore;
      grouping = newGrouping;
    }
  }
  console.log("Final grouping score: ", score);
  return grouping.map(group => ({ userIds: group.map(registration => registration.student.id) } as GroupInput));
};

export const findGroupForGrouplessStudents = (
  grouplessStudents: Registration[],
  grouping: Grouping,
  targetGroupSize: number,
): GroupInput[] => {
  grouplessStudents.map(student => {
    let topScore = -1;
    let groupIndex = -1;

    grouping.map((group, index) => {
      const groupClone = _.clone(group);
      groupClone.push(student);
      const score = evaluateBoth(groupClone);
      if (score > topScore && groupClone.length <= targetGroupSize + 1 && groupClone.length >= targetGroupSize - 1) {
        groupIndex = index;
        topScore = score;
      }
    });

    if (groupIndex != -1) {
      grouping[groupIndex].push(student);
    }
  });

  return grouping.map(group => ({ userIds: group.map(registration => registration.student.id) } as GroupInput));
};
