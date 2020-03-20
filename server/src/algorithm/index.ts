import createData from "./mockdata";
import { Registration } from "../entities/Registration";
import { Course } from "../entities/Course";
import { GroupInput } from "../inputs/GroupInput";
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

export const formGroups = (course: Course, registrations: Registration[]): GroupInput[] => {
  const minSize = course.minGroupSize;
  const shuffledStudents = shuffle(registrations.map(reg => reg.studentId));
  const groups = new Array();
  const numberOfGroups = Math.floor(registrations.length / minSize);

  //quick fix if there aren't enough registrations to fill one minimum sized group
  if (numberOfGroups == 0) {
    const group = new GroupInput();
    group.userIds = shuffledStudents;
    groups.push(group);
  } else {
    let groupSizes = Array(numberOfGroups).fill(minSize);

    for (let i = 0; i < registrations.length % minSize; i++) {
      groupSizes[i % groupSizes.length]++;
    }

    for (let i = 0; i < groupSizes.length; i++) {
      const group = new GroupInput();
      group.userIds = shuffledStudents.splice(0, groupSizes[i]);
      groups.push(group);
    }
  }

  return groups;
};
