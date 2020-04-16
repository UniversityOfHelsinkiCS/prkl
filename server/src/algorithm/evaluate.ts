// const enoughAvalableTimes = (data: object, group: string[], treshold: number): boolean => {
//   let timeslots = 0;
//   const groupTimes = new Array();
//   group.forEach(student => groupTimes.push(data[student].times));

import { GroupInput } from "../inputs/GroupInput";
import { QuestionsMap } from "./types";

//   for (let i = 0; i < groupTimes[0].length; i++) {
//     let found = true;

//     for (let j = 0; j < group.length; j++) {
//       if (groupTimes[j][i] < 10) {
//         found = false;
//         break;
//       }
//     }
//     if (found === true) {
//       timeslots++;
//       if (timeslots >= treshold) {
//         return true;
//       }
//     }
//   }

//   return false;
// };

const sd = (values: number[]): number => {
  const total = values.reduce((a, b) => a + b, 0);
  const av = total / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(av - b, 2), 0) / values.length;
  return Math.sqrt(variance);
};

const toVectors = (group: string[], allAnswers: QuestionsMap): Array<number[]> => {
  const answerList = [];

  group.forEach(a => {
    const personalAnswers = [];
    allAnswers[a].forEach(answer => {
      if (answer.type === "singleChoice") {
        personalAnswers.push(answer.selected[0]);
      } else if (answer.type === "multipleChoice") {
        const list = [];
        for (let i = 0; i < answer.totalChoices; i++) {
          list.push(0);
        }
        answer.selected.forEach(s => (list[s - 1] = 1));

        list.forEach(s => personalAnswers.push(s));
      }
    });

    answerList.push(personalAnswers);
  });

  const actual = [];
  for (let i = 0; i < answerList[0].length; i++) {
    actual.push([]);
    for (let j = 0; j < answerList.length; j++) {
      actual[i].push(answerList[j][i]);
    }
  }

  return actual;
};

// export const evaluateGroup = (data: object, group: string[], minTime: number): number => {
//   if (enoughAvalableTimes(data, group, minTime)) {
//     return 100;
//   } else {
//     return 0;
//   }
// };

export const evaluateGroup = (group: string[], allAnswers: QuestionsMap): number => {
  const answers = toVectors(group, allAnswers);

  const score = answers.reduce((a, b) => a + sd(b), 0);

  return score;
};

// export const evaluateGroups = (data: object, groups: string[][], minTime: number): number => {
//   return groups.reduce((a, b) => a + evaluateGroup(data, b, minTime), 0);
// };

export const evaluateGroups = (groups: GroupInput[], answers: QuestionsMap): number => {
  const total = groups.reduce((a, b) => a + evaluateGroup(b.userIds, answers), 0);

  return total;
};
