import _ from "lodash";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";

export const combinationsOfTwo = (arr: any[]): [any, any][] => {
    const combinations = []

    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            combinations.push([arr[i], arr[j]])
        }
    }

    return combinations
}

export const multipleScorePair = (pair: [Registration, Registration]): number => {
    const answers = _.map(pair,
        registration =>
            _.flatMap(registration.questionAnswers.filter(answer =>
                (answer.question.useInGroupCreation && (answer.question.questionType === "multipleChoice" || answer.question.questionType === "singleChoice"))),
                answer => _.map(answer.answerChoices,
                    choice => ([answer.questionId, choice.id, answer.question.content, choice.content]))))

    if (answers[0].length === 0 || answers[1].length === 0) {
        return 0;
    }

    const answerCount = answers[0].length + answers[1].length;
    const sameAnswerCount = _.intersectionWith(answers[0], answers[1], _.isEqual).length * 2;

    return sameAnswerCount / answerCount
}

const evaluateGroupByMultipleChoice: Evaluator = (group: Group) => {
    if (group.length === 1) {
        return 0;
    }

    const uniquePairs = combinationsOfTwo(group)
    const scores = uniquePairs.map(multipleScorePair)
    return average(scores)
}

const average = (arr: number[]) => arr.reduce((sum, elem) => sum + elem) / arr.length

export default evaluateGroupByMultipleChoice
