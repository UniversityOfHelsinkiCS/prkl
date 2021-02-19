import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import * as _ from "lodash";

// import evaluateGroupByMultipleChoice from "./evaluators/evaluateByMultipleChoice";
// import evaluateGroupByWorkingHours from "./evaluators/evaluateByWorkingHours";
import evaluateBoth from "./evaluators/bothEvaluators";

import { workingTimeObject } from "./evaluators/evaluateByWorkingHours";

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[];

export type Evaluator = (group: Group) => number;

export type Group = Registration[];

export type Grouping = Group[];

export type GroupTimes = {
  id: number,
  Group: Group,
  workingTimes: Map<number, Map<number,number>>
}

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


export const findGroupForOneStudent = (student: Registration, grouping: Grouping): GroupInput[] => {
  let id = -1;
  const mapWorkingTimes = (grouping: Grouping): GroupTimes[] => {
    return grouping.map(group => {
      id++;
      const groupWorkingTimes = new Map<number, Map<number,number>>();
      return {
        id: id,
        Group: group,
        workingTimes: groupWorkingTimes
      };
    });
  };

  const allHours = (workDay: workingTimeObject, map: Map<number, Map<number,number>>) => {
    for (let i = workDay.startHour; i < workDay.endHour; i++) {
      if (!map.has(workDay.startDay)) {
        map.set(workDay.startDay, new Map<number,number>());
      };
      const totalHours = map.get(workDay.startDay);
      totalHours.set(workDay.startHour, totalHours.get(workDay.startHour) +1);
      map.set(workDay.startDay, totalHours);
    };
  };

  const studentsMissingTimes = (timeObject: workingTimeObject, workingTimeList: workingTimeObject[]): workingTimeObject[] => {
    for (let i = timeObject.startHour; i < timeObject.endHour; i++) {
      const startDay = timeObject.startDay;
      const startHour = i;
      const endHour = i + 1;
      const workingTime = {startDay, startHour, endHour, handled: false};
      workingTimeList.push(workingTime);
    }
    return workingTimeList;
  }

  const groupsWithWorkingTimesMap = mapWorkingTimes(grouping);

  groupsWithWorkingTimesMap.map(group => {
    group.Group.map(registration => {
      registration.workingTimes.map(times => {
        const startDay = times.startTime.getDay();
        const startHour = times.startTime.getHours();
        const endHour = times.endTime.getHours();
        const workingTime = {startDay, startHour, endHour, handled: false};
        allHours(workingTime, group.workingTimes);
      });
    });
  });

  const studentsWorkingTimeList: workingTimeObject[] = [];
  student.workingTimes.map(times => {
      const startDay = times.startTime.getDay();
      const startHour = times.startTime.getHours();
      const endHour = times.endTime.getHours();
      const workingTime = {startDay, startHour, endHour, handled: false};
      studentsMissingTimes(workingTime, studentsWorkingTimeList);
  });

  const groupWithMostCommonHours = new Map<number, number>()

  for (let i = 0; i < id; i++) {
    groupWithMostCommonHours.set(i, 0);
  }

  for (const workingTime of studentsWorkingTimeList) {
    for (const group of groupsWithWorkingTimesMap) {
      if (group.workingTimes.has(workingTime.startDay)) {
        if (group.workingTimes.get(workingTime.startDay).has(workingTime.startHour)) {
          
        }
      }
    }
  }

  return grouping.map(group => ({ userIds: group.map(registration => registration.student.id) } as GroupInput));
};
