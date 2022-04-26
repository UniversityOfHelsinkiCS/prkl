import _ from "lodash";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";

export const combinationsOfTwo = (arr: Registration[]): [Registration, Registration][] => {
  const combinations: [Registration, Registration][] = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      combinations.push([arr[i], arr[j]]);
    }
  }

  return combinations;
};

// this function return 1 point per same anwnser per question. Multiple same anwsers on multichoise dont give extra points
export const multipleScorePair = (pair: [Registration, Registration]): number => {
  const step1 = (answer) => {
    const res =
      answer.question.useInGroupCreation &&
      (answer.question.questionType === "multipleChoice" || answer.question.questionType === "singleChoice");
    return res;
  };

  const step2 = (answer) => {
    const res = _.map(
      answer.answerChoices,
      (choice) => <string[]>[answer.questionId, choice.id, answer.question.content, choice.content],
    );
    return res;
  };

  const step3 = (registration: Registration) => {
    const res = _.flatMap(registration.questionAnswers.filter(step1), step2);
    return res;
  };

  const answers = _.map(pair, step3);

  if (answers[0].length === 0 || answers[1].length === 0) {
    return 0;
  }

  const sameAnswers = _.intersectionWith(answers[0], answers[1], (a1, a2) => _.isEqual(a1, a2));
  const sameAnswersPerQuestion = _.uniqBy(sameAnswers, (a) => a[0]);

  return sameAnswersPerQuestion.length;
};

const evaluateGroupByMultipleChoice: Evaluator = (group: Group) => {
  if (group.length === 1) {
    return 0;
  }

  const uniquePairs = combinationsOfTwo(group);
  const scores = uniquePairs.map(multipleScorePair);
  return average(scores);
};

const average = (arr: number[]) => arr.reduce((sum, elem) => sum + elem) / arr.length;

export default evaluateGroupByMultipleChoice;
