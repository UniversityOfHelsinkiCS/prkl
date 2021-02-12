import _ from "lodash";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";

export const combinationsOfTwo = (arr: any[]): [any, any][] => {
    const combinations = []

    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            combinations.push([arr[i], arr[j]])
        }
    }

    return combinations
}

const scorePair = (pair: [Registration, Registration]): number => {
    const answers = _.map(pair,
        registration =>

            _.flatMap(registration.questionAnswers.filter(answer => answer.question.questionType === "multipleChoice"),
                answer => _.map(answer.answerChoices,
                    choice => ([answer.questionId, choice.id, answer.question.content, choice.content]))))

    const answerCount = answers[0].length + answers[1].length
    const sameAnswerCount = _.intersectionWith(answers[0], answers[1], _.isEqual).length * 2

    return sameAnswerCount / answerCount
}

const evaluateGroupByMultipleChoice: Evaluator = (group: Group) => {
    if (group.length === 1) {
        return 0;
    }

    const uniquePairs = combinationsOfTwo(group)
    const scores = uniquePairs.map(scorePair)
    const score = average(scores)
    return score
}

const average = (arr: number[]) => arr.reduce((sum, elem) => sum + elem) / arr.length


export default evaluateGroupByMultipleChoice
