import { Evaluator, Group } from "../algorithm";

const evaluateGroupByMultipleChoice: Evaluator = (group: Group) => {
    const answerCounts = calculateAnswerCounts(group)
    const questionScores = calculateQuestionScores(answerCounts, group.length)
    const averageScores = mapOverMap(questionScores, ([questionId, choices]) => 
        [questionId, average(Array.from(choices.values()))])
    return average(Array.from(averageScores.values()))
}

const average = (arr: number[]) => arr.reduce((sum, elem) => sum + elem) / arr.length

const mapOverMap = <K, V>(map: Map<K, V>, func: ([key, value]: [K, V]) => ([K, any]))  =>
    new Map(Array.from(map.entries()).map(func))

    
const calculateAnswerCounts = (group: Group) => {
    const answerCounts: Map<string, Map<string, number>> = new Map()
    group.forEach(
        registration => registration.questionAnswers.forEach(
                answer => answer.answerChoices.forEach(
                        choice => {
                            if (!answerCounts.has(answer.questionId)) {
                                answerCounts.set(answer.questionId, new Map())
                            }

                            const count = answerCounts.get(answer.questionId).get(choice.id) || 0
                            answerCounts.get(answer.questionId).set(choice.id, count + 1)
                        }
                    )
            )
    )
    return answerCounts
}

const calculateQuestionScores = (answerCounts: Map<string, Map<string, number>>, groupSize: number): Map<string, Map<string, number>> => {
    return mapOverMap(answerCounts, ([questionId, choices]) => 
            [questionId, mapOverMap(choices, ([choiceId, count]) => 
                    [choiceId, count > 1 ? count / groupSize : 0])]
    )
}

export default evaluateGroupByMultipleChoice