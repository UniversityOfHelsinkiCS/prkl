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

export const formGroups = (course: Course, registrations: Registration[]) => {
  const minSize = course.minGroupSize;

  let groupSizes = Array(Math.floor(registrations.length / minSize)).fill(minSize);

  for (let i = 0; i < registrations.length % minSize; i++) {
    groupSizes[i % groupSizes.length]++;
  }

  const groups = new Array();

  for (let i = 0; i < groupSizes.length; i++) {
    let group = new GroupInput();
    let groupRegistrations = registrations.splice(0, groupSizes[i]);
    group.userIds = groupRegistrations.map(reg => reg.studentId);
    groups.push(group);
  }

  return groups;
};
