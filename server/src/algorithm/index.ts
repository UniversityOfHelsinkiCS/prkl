import { Registration } from "../entities/Registration";
import { Course } from "../entities/Course";
import { GroupInput } from "../inputs/GroupInput";
import { AllTimes, MaxAvailableTimes, DividedGroup } from "./types";

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
      const diff = time.endTime.getHours() - start;
      let day = time.startTime.getDay();
      // Tämä koska maanantai on 1 ja sunnuntai 0
      if (day === 0) {
        day = 7;
      }
      day--;
      return {
        start,
        diff,
        day,
        tentative: time.tentative,
      };
    });
    result[mem.studentId] = workingTimes;
  });
  return result;
};

const count = (group: AllTimes, len: number): Array<string[]> => {
  const times: Array<string[]> = [...Array(7 * hours)].map(() => []);

  Object.entries(group).forEach(mem => {
    mem[1].forEach(time => {
      if (time.diff >= len) {
        for (let i = 0; i <= time.diff - len; i++) {
          times[time.day * hours + (time.start - first) + i].push(mem[0]);
        }
      }
    });
  });

  return times;
};

const divide = (len: number, size: number, answers: AllTimes, availabletimes: MaxAvailableTimes): DividedGroup => {
  const groups = [];

  if (len === 0) {
    if (Object.keys(answers).length > 0) {
      groups.push({ userIds: Object.keys(answers) });
    }
    return { groups, score: 0 };
  }

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
  // Weight to value better (longer common timeslot) groups more
  const weight = len * 3;

  let score = groups.length * weight;

  // Try remaining students with relaxed time constraints
  const rec = divide(len - 1, size, answers, availabletimes);
  score += rec.score;
  rec.groups.forEach(group => {
    groups.push(group);
  });

  return { groups, score };
};

const countAvailable = (group: AllTimes): MaxAvailableTimes => {
  const availabletimes = {};

  Object.entries(group).forEach(mem => {
    let sum = 0;
    mem[1].forEach(time => {
      sum += time.diff;
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

  const simplifiedRegistrations = toTimes(registrations);

  const availableTimes: MaxAvailableTimes = countAvailable(simplifiedRegistrations);
  let best: DividedGroup = { groups: [], score: 0 };

  let groups: DividedGroup = { groups: [], score: 0 };
  for (let i = 0; i < 1000; i++) {
    const answers = { ...simplifiedRegistrations };

    groups = divide(targetTimeSlot, minSize, answers, availableTimes);

    if (groups.score > best.score) {
      best = groups;
    }
  }

  return best.groups;
};
