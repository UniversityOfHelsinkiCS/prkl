import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import { AllTimes, MaxAvailableTimes, DividedGroup, QuestionsMap } from "./types";
import { evaluateGroups } from "./evaluate";

const hours = 14;
const first = 6;

/**
 * Shuffles the given list to random order.
 * @param {Array} arr list to be shuffled
 * @return {Array} shuffled list
 */
const shuffle = (arr: any[]): any[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

/**
 * Maps the registrations to a hashmap where the key is student's user id and value is question answers.
 * @param {[Registration]} group list of registrations to be mapped
 * @return {QuestionsMap} HashMap of registrations, key is student's user id and value is question answers.
 */
const toQuestions = (group: Registration[]): QuestionsMap => {
  const result = {};
  group.forEach(r => {
    result[r.student.id] = r.questionAnswers
      .filter(a => a.question.questionType !== "freeForm")
      .map(a => {
        const acObject = {
          type: a.question.questionType,
          totalChoices: a.question.questionChoices.length,
          selected: a.answerChoices.map(c => (c instanceof Number ? c.order : Number.parseInt(`${c.order}`, 10))),
        };
        return acObject;
      });
  });
  return result;
};

/**
 * Maps the registrations to a hashmap where the key is student's user id and value is working times.
 * Cuts the working times to be between 8:00 and 22:00 Finnish time.
 * @param {[Registration]} group list of registrations to be mapped
 * @return {AllTimes} HashMap of working times, key is student's user id and value is working times.
 */
const toTimes = (group: Registration[]): AllTimes => {
  const result = {};
  group.forEach(mem => {
    const workingTimes = mem.workingTimes.map(time => {
      const start = Math.max(Math.min(time.startTime.getHours(), 20), 6);
      const diff = Math.max(
        Math.min(time.endTime.getDay() == time.startTime.getDay() ? time.endTime.getHours() : 20, 20) - start,
        0,
      );
      let day = time.startTime.getDay();

      // This because Monday is 1 and Sunday 0
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

/**
 * Returns list of students having long enough common time slots starting from each hour
 * @param {AllTimes} group HashMap of working times, key is student's user id and value is working times.
 * @param {number} len length of timeslot
 * @return {Array<string[]>} List of groups, each group containing a list of user ids
 */
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

/**
 * Returns list of students having long enough common time slots starting from each hour
 * @param {AllTimes} answers HashMap of working times, key is student's user id and value is working times.
 * @param {number} size target group size
 * @return {Array<string[]>} Array of timeslots, each timeslot containing a list of students who have enough
 *    available time starting from that slot
 */
const divideByQuestions = (answers: AllTimes, size: number): Array<string[]> => {
  const leftovers = Object.keys(answers);
  const randomizedTimeslots = shuffle([...Array(leftovers.length).keys()]);
  const groups = [];

  let index = 0;
  let round = -1;
  while (index < leftovers.length) {
    if (index % size === 0) {
      groups.push([]);
      round++;
    }
    groups[round].push(leftovers[randomizedTimeslots[index]]);
    index++;
  }

  return groups;
};

/**
 * Recursively divides groups based on common working times. Tries to first form as many groups as possible with wanted sized timeslots
 * and then tries smaller timeslots until everyone is divided to groups. Takes into account only consecutive hours.
 * @param {number} len length of timeslot
 * @param {number} size target group size
 * @param {AllTimes} answers HashMap of working times, key is student's user id and value is working times.
 * @param {MaxAvailableTimes} availableTimes HashMap of sums of available times, key is student's user id and value is sum of available times.
 * @return {DividedGroup} list of formed groups and a score describing how good the groups are based on common working times.
 */
const divide = (len: number, size: number, answers: AllTimes, availabletimes: MaxAvailableTimes): DividedGroup => {
  const groups = [];

  if (len === 0) {
    if (Object.keys(answers).length > size) {
      const res = divideByQuestions(answers, size);
      res.forEach(group => {
        groups.push({ userIds: group });
      });
    } else if (Object.keys(answers).length > 0) {
      groups.push({ userIds: Object.keys(answers) });
    }
    return { groups, score: 0 };
  }

  let times = count(answers, len);
  const randomizedTimeslots = shuffle([...Array(7 * hours).keys()]);

  let i = 0;

  while (i < 7 * hours) {
    const time = shuffle(times[randomizedTimeslots[i]]);
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

/**
 * Counts total sum of available times for each student.
 * @param {AllTimes} group HashMap of all students and their available times
 * @return {MaxAvailableTimes} HashMap of sums of available times, key is student's user id and value is sum of available times.
 */
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

/**
 * This is the old algorithm! New one is in the file new_algo.ts.
 * Forms groups based on common working times and similarity in question answers.
 * @param {number} targetGroupSize target size of the groups
 * @param {[Registration]} registrations list of registrations to the course
 * @return {[GroupInput]} List of formed groups
 */
export const formGroups = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {
  const questionMapObject = toQuestions(registrations);
  const questionScoreWeight = 0.2;
  const targetTimeSlot = 4;
  const simplifiedRegistrations = toTimes(registrations);
  const availableTimes: MaxAvailableTimes = countAvailable(simplifiedRegistrations);

  let best: DividedGroup = { groups: [], score: -694201337 };
  let groups: DividedGroup = { groups: [], score: 0 };

  for (let i = 0; i < 1000; i++) {
    const answers = { ...simplifiedRegistrations };

    groups = divide(targetTimeSlot, targetGroupSize, answers, availableTimes);

    const questionScore = evaluateGroups(groups.groups, questionMapObject) * questionScoreWeight;
    groups.score -= questionScore;

    if (groups.score > best.score) {
      best = groups;
    }
  }
  console.log('\n\n\n')
  console.log('best.groups', best.groups);
  return best.groups;
};
