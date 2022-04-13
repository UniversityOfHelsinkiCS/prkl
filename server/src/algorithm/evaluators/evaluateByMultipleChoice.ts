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

export const multipleScorePair2 = (pair: [Registration, Registration]): number => {
    const answers = _.map(pair,
        registration =>
            _.flatMap(registration.questionAnswers.filter(answer =>
                (answer.question.useInGroupCreation && (answer.question.questionType === "multipleChoice" || answer.question.questionType === "singleChoice"))),
                answer => _.map(answer.answerChoices,
                    choice => ([answer.questionId, choice.id, answer.question.content, choice.content]))))

    if (answers[0].length === 0 || answers[1].length === 0) {
        return 0;
    }

    const answerCount = answers[0].length + answers[1].length
    const sameAnswerCount = _.intersectionWith(answers[0], answers[1], _.isEqual).length * 2
    console.log(_.intersectionWith(answers[0], answers[1], _.isEqual));

    // this is not optimal awnser! The goal shoud be to find the first common anwnser and return 1 immediately
    return sameAnswerCount > 0 ? 1 : 0

    // Old return
    // return sameAnswerCount / answerCount
}

export const multipleScorePair = (pair: [Registration, Registration]): number => {
    const step1 = (answer) => {
        const res = (answer.question.useInGroupCreation && (answer.question.questionType === "multipleChoice" || answer.question.questionType === "singleChoice"))
        return res
    }

    const step2 = (answer) => {
        const res = _.map(answer.answerChoices, choice => ([answer.questionId, choice.id, answer.question.content, choice.content]))
        return res
    }

    const step3 = (registration) => {
        const res = _.flatMap(registration.questionAnswers.filter(step1), step2)
        return res
    }

    const answers = _.map(pair, step3)

    if (answers[0].length === 0 || answers[1].length === 0) {
        return 0;
    }

    const sameAnswers = _.intersectionWith(answers[0], answers[1], _.isEqual)
    const sameAnswersPerQuestion = _.uniqBy(sameAnswers, a => a[0])

    return sameAnswersPerQuestion.length
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
