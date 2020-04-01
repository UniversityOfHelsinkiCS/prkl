import createData from "./mockdata";
import { Registration } from "../entities/Registration";
import { WorkingTimes } from "../entities/WorkingTimes";
import { Course } from "../entities/Course";
import { GroupInput } from "../inputs/GroupInput";
import { access } from "fs";
// kutsumalla createData(n) palauttaa n registrationia listana
// neljä kysymystä:
// 1. monivalinta, 4 vaihtoehtoa,
// 2. monivalinta, 5 vaihtoehtoa,
// 3. singlevalita, 3 vaihtoehtoa,
// 4. singlevalita, 4 vaihtoehtoa

const shuffle = (arr: Array<string>): Array<string> => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

//TODO: parametrise timeslots and value
const convertTimes = (workingTimes: WorkingTimes[]): Array<number> => {
  const startingHour = 8;
  const slotsPerDay = 14;
  const daysInWeek = 5;

  return workingTimes.reduce((acc, times) => {
    const startIndex = times.startTime.getDay() - 5 * slotsPerDay + times.startTime.getHours() - startingHour;
    const endIndex = startIndex + times.endTime.getHours() - startingHour - 1;
    const value = 10;

    return acc.fill(value, startIndex, endIndex);
  }, new Array(daysInWeek * slotsPerDay).fill(0));
};

const convertRegistrations = (registrations: Registration[]): object => {
  return registrations.reduce((acc, reg) => {
    return (acc[reg.studentId] = { times: convertTimes(reg.workingTimes) });
  }, {});
};

export const formGroups = (course: Course, registrations: Registration[]): GroupInput[] => {
  const minSize = course.minGroupSize;
  const shuffledStudents = shuffle(registrations.map(reg => reg.studentId));
  const groups = new Array();
  const numberOfGroups = Math.floor(registrations.length / minSize);

  let groupSizes = Array(numberOfGroups).fill(minSize);

  for (let i = 0; i < registrations.length % minSize; i++) {
    groupSizes[i % groupSizes.length]++;
  }

  //quick fix if there aren't enough registrations to fill one minimum sized group
  if (groupSizes.length == 0) groupSizes.push(registrations.length);

  for (let i = 0; i < groupSizes.length; i++) {
    const group = new GroupInput();
    group.userIds = shuffledStudents.splice(0, groupSizes[i]);
    groups.push(group);
  }

  return groups;
};
