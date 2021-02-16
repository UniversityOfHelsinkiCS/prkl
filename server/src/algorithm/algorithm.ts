import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import * as _ from "lodash";

// import evaluateGroupByMultipleChoice from "./evaluators/evaluateByMultipleChoice";
// import evaluateGroupByWorkingHours from "./evaluators/evaluateByWorkingHours";
import evaluateBoth from "./evaluators/bothEvaluators";

import { performance } from "perf_hooks";

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[];

export type Evaluator = (group: Group) => number;

export type Group = Registration[];

export type Grouping = Group[];

const sum = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0);

//const ITERATIONS = 10000;

const scoreBoth = (grouping: Grouping) => {
  return sum(grouping.map(evaluateBoth));
};

// Generates random groups and makes sure that all groups are of approx. same size
const createRandomGrouping = (targetGroupSize: number, registrations: Registration[]) => {
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

const mutateGrouping = (grouping: Grouping) => {
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

  for (let i = 0; i < Math.pow(registrations.length, 2); i++) {
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
