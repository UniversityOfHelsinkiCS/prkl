import { GroupInput } from "../inputs/GroupInput";
import { QuestionsMap } from "./types";

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

export const evaluateGroup = (group: string[], allAnswers: QuestionsMap): number => {
  const answers = toVectors(group, allAnswers);

  const score = answers.reduce((sum, b) => sum + sd(b), 0);

  return score;
};

/**
 * Evaluates the groups based on similarity to answered questions.
 * @param {[Groupinput]} groups list of groups to be evaluated
 * @param {QuestionsMap} answers HashMap of question answers, key is student's user id and value is question answers.
 * @return {number} value of the group
 */
export const evaluateGroups = (groups: GroupInput[], answers: QuestionsMap): number => {
  const total = groups.reduce((sum, group) => sum + evaluateGroup(group.userIds, answers), 0);

  return total;
};
