import evaluateGroupByMultipleChoice from "../src/algorithm/evaluators/evaluateByMultipleChoice"
import { Answer } from "../src/entities/Answer"
import { Registration } from "../src/entities/Registration"

/* 
    The 2d array is interpreted as follows:
    [
        [], // answers to the first question
        ["a choice", "another choice"], // answers to the second question
        ["Javascript", ""], // answers to the third question
    ]
*/
const createFakeRegistration = (answers: string[][]): Registration => {
    return {
        questionAnswers: answers.map((choices, index) => ({
            answerChoices: choices.map(
                choice => ({
                    id: choice
                })
            ),
            question: {questionType: "multipleChoice"},
            questionId: index.toString()
        }))
    } as Registration
}

describe("evaluateByMultipleChoice", () => {
    it("returns 1 for identical answers with two registrations", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"]]),
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1)
    })

    it("returns 0.5 when half of answers are the same with two registrations", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "thirdChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0.5)
    })

    it("returns 0 when no answers are the same with two registrations", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "thirdChoice"]]),
            createFakeRegistration([["secondChoice", "fourthChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0)
    })

    it("returns 1 for identical answers with three registrations", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1)
    })

    it("returns 1 for identical answers with three registrations and two questions", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "secondChoice"], ["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"], ["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"], ["firstChoice", "secondChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1)
    })

    it("returns 0.5 when one questions answers are identical and ones are not the same", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "secondChoice"], ["firstChoice", "secondChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"], ["thirdChoice", "fourthChoice"]]),
            createFakeRegistration([["firstChoice", "secondChoice"], ["fifthChoice", "sixthChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0.5)
    })

    it("returns 0 when the group has only one person", () => {
        const registrations = [
            createFakeRegistration([["firstChoice", "secondChoice"], ["firstChoice", "secondChoice"]])
        ]

        expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0)
    })
})