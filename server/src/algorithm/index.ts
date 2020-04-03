import { Registration } from "../entities/Registration";
import { WorkingTimes } from "../entities/WorkingTimes";
import { Course } from "../entities/Course";
import { GroupInput } from "../inputs/GroupInput";
import { AllTimes, MaxAvailableTimes } from "./types";

const hours = 14;
const first = 6;
// Ilmottautuneiden pitunen lista, ilmottautuneelle total kelpaavat ajat

const shuffle = (arr: Array<number>): Array<number> => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

const toTimes = (group: Registration[]): AllTimes => {
  const result = {};
  group.forEach(mem => {
    const workingTimes = mem.workingTimes.map(time => {
      const start = time.startTime.getHours();
      const end = time.endTime.getHours();
      let day = time.startTime.getDay();
      // Tämä koska maanantai on 1 ja sunnuntai 0
      if (day === 0) {
        day = 7;
      }
      day--;
      return {
        start,
        end,
        day,
        tentative: time.tentative,
      };
    });
    result[mem.studentId] = workingTimes;
  });
  return result;
};

const count = (group: AllTimes, len: number): Array<string[]> => {
  const times: Array<string[]> = [...Array(7 * hours)].map(e => []);

  Object.entries(group).forEach(mem => {
    mem[1].forEach(time => {
      const start = time.start;
      const end = time.end;
      let day = time.day;

      if (day === 0) {
        day = 7;
      }
      day--;

      const diff = end - start;

      if (diff >= len) {
        for (let i = 0; i <= diff - len; i++) {
          times[day * hours + (start - first) + i].push(mem[0]);
        }
      }
    });
  });

  return times;
};

const divide = (
  len: number,
  size: number,
  randoms: Registration[],
  availabletimes: MaxAvailableTimes,
): GroupInput[] => {
  const groups = [];
  const answers = toTimes(randoms);

  let times = count(answers, len);
  const randomizedTimeslots = shuffle([...Array(7 * hours).keys()]);

  let i = 0;

  while (i < 7 * hours) {
    const time = times[randomizedTimeslots[i]];
    if (time.length >= size) {
      time.sort((a, b) => availabletimes[b] - availabletimes[a]);
      const group: string[] = time.splice(time.length - size);
      groups.push({ userIds: group });

      group.forEach(member => {
        delete answers[member];
      });
      times = count(answers, len);
    } else {
      i++;
    }
  }
  return groups;
};

const countAvailable = (group: AllTimes): MaxAvailableTimes => {
  const availabletimes = {};

  Object.entries(group).forEach(mem => {
    let sum = 0;
    mem[1].forEach(time => {
      const diff = time.end - time.start;
      sum += diff;
    });
    availabletimes[mem[0]] = sum;
  });
  return availabletimes;
};

export const formGroups = (course: Course, registrations: Registration[]): GroupInput[] => {
  const minSize = course.minGroupSize;
  const numberOfGroups = Math.floor(registrations.length / minSize);

  const targetTimeSlot = 4;

  const groupSizes = Array(numberOfGroups).fill(minSize);

  for (let i = 0; i < registrations.length % minSize; i++) {
    groupSizes[i % groupSizes.length]++;
  }

  const availableTimes: MaxAvailableTimes = countAvailable(toTimes(registrations));
  let best = [];

  let groups: GroupInput[] = [];
  for (let i = 0; i < 5; i++) {
    groups = divide(targetTimeSlot, minSize, registrations, availableTimes);

    if (groups.length > best.length) {
      best = groups;
    }
  }

  return best;
};
