import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import * as _ from "lodash";

// import evaluateGroupByMultipleChoice from "./evaluators/evaluateByMultipleChoice";
// import evaluateGroupByWorkingHours from "./evaluators/evaluateByWorkingHours";
import evaluateBoth from "./evaluators/bothEvaluators";

import { workingTimeObject, workingTimeList } from "./evaluators/evaluateByWorkingHours";

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[];

export type Evaluator = (group: Group) => number;

export type Group = Registration[];

export type Grouping = Group[];

export type GroupTimes = {
  id: number,
  Group: Group,
  workingTimes: Map<number, Map<number,number>>
}

export type GrouplessStudent = {
  registration: Registration
  commonHoursWithOtherGroups: Map<number, number>
}

export type grouplessStudentsWorkingTimes = workingTimeList[];

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

export const findGroupForGrouplessStudents = (students: Registration[], grouping: Grouping, maxGroupSize: number): GroupInput[] => {
  
  const tooLargeGroups = [];
  const grouplessStudents: GrouplessStudent[] = []

  students.map(student => {
    const map = new Map<number, number>();
    for (let i = 0; i < grouping.length; i++) {
      map.set(i, 0);
    }
    const groupless: GrouplessStudent = {
      registration: student,
      commonHoursWithOtherGroups: map
    }
    grouplessStudents.push(groupless)
  })

  const addWorkingTimesMapToGroup = (grouping: Grouping): GroupTimes[] => {
    return grouping.map((group, index) => {
      const groupWorkingTimes = new Map<number, Map<number,number>>();
      if (group.length >= maxGroupSize) {
        tooLargeGroups.push(index);
      }
      return {
        id: index,
        Group: group,
        workingTimes: groupWorkingTimes
      };
    });
  };

  const groupsCombinedHours = (workDay: workingTimeObject, map: Map<number, Map<number,number>>) => {
    for (let hour = workDay.startHour; hour < workDay.endHour; hour++) {

      if (!map.has(workDay.startDay)) {
        map.set(workDay.startDay, new Map<number,number>());
      };

      if (!map.get(workDay.startDay).has(hour)) {
        map.get(workDay.startDay).set(hour, 0);
      }

      const totalHours = map.get(workDay.startDay);
      totalHours.set(hour, totalHours.get(hour) +1);
      map.set(workDay.startDay, totalHours); 

//      console.log('group id: ', group.id, 'paiva: ', workDay.startDay, 'tunti: ', hour, 'total: ', totalHours.get(hour))
    };
  };

  const studentsMissingTimes = (
    timeObject: workingTimeObject,
    grouplessStudentsWorkingTimeList: grouplessStudentsWorkingTimes,
    index: number
  ): grouplessStudentsWorkingTimes => {

    if (grouplessStudentsWorkingTimeList[index] === undefined) {
      const workingTimeList: workingTimeList = [];
      grouplessStudentsWorkingTimeList[index] = workingTimeList
    }
    for (let i = timeObject.startHour; i < timeObject.endHour; i++) {
      const startDay = timeObject.startDay;
      const startHour = i;
      const endHour = i + 1;
      const workingTime = {startDay, startHour, endHour, handled: false};
      const studentsWorkingTimeList = grouplessStudentsWorkingTimeList[index]
      studentsWorkingTimeList.push(workingTime);
    }
    return grouplessStudentsWorkingTimeList;
  }

  const groupsWithWorkingTimesMap = addWorkingTimesMapToGroup(grouping);

  groupsWithWorkingTimesMap.map(group => {
    group.Group.map(registration => {
      registration.workingTimes.map(times => {
        const startDay = times.startTime.getDay();
        const startHour = times.startTime.getHours();
        const endHour = times.endTime.getHours();
        const workingTime = {startDay, startHour, endHour, handled: false};
        groupsCombinedHours(workingTime, group.workingTimes);
      });
    });
  });

  const grouplessStudentsWorkingTimeList: grouplessStudentsWorkingTimes = [];

//  console.log('grouplessstudents length', grouplessStudents.length)
  students.map((student, index) => {
    student.workingTimes.map(times => {
      const startDay = times.startTime.getDay();
      const startHour = times.startTime.getHours();
      const endHour = times.endTime.getHours();
      const workingTime = {startDay, startHour, endHour, handled: false};
      studentsMissingTimes(workingTime, grouplessStudentsWorkingTimeList, index);
    });
  })
  
 // console.log(grouplessStudentsWorkingTimeList[0], grouplessStudentsWorkingTimeList.length);

  grouplessStudents.map((student, index) => {
    grouplessStudentsWorkingTimeList[index].map(workingTime => {
      groupsWithWorkingTimesMap.map(group => {
        if (group.workingTimes.has(workingTime.startDay)) {
          if (group.workingTimes.get(workingTime.startDay).has(workingTime.startHour)) {
            const commonHours = group.workingTimes.get(workingTime.startDay).get(workingTime.startHour);
            const totalHours = student.commonHoursWithOtherGroups.get(group.id) + commonHours;
            student.commonHoursWithOtherGroups.set(group.id, totalHours);
          }
        }
      })
    })
  })

  let index = 0;

  for (const student of grouplessStudents) {
    let topScore = -1;
    let groupId = -1;

    for (let i = 0; i < student.commonHoursWithOtherGroups.size; i++) {
      if (student.commonHoursWithOtherGroups.get(i) > topScore && !tooLargeGroups.includes(i)) {
        topScore = student.commonHoursWithOtherGroups.get(i);
        groupId = i;
      }
    }

    groupsWithWorkingTimesMap.forEach(group => {
      if (group.id === groupId) {
        group.Group.push(students[index]);
        if (group.Group.length >= maxGroupSize) {
          tooLargeGroups.push(group.id);
        }
      }
    });

    index++;
  }

  return groupsWithWorkingTimesMap.map(group => ({ userIds: group.Group.map(registration => registration.student.id) } as GroupInput));
};
