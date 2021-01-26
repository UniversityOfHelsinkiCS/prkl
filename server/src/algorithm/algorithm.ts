import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";

import evaluateGroupByMultipleChoice from "./evaluators/evaluateByMultipleChoice"

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[]

export type Evaluator = (group: Group) => number

export type Group = Registration[]

// PSEUDOCODE
/* 

const EVALUATORS = [
    [evaluateGroupByMultipleChoice, 0.5]
    [evaluateGroupByWorkingHours, 0.5]
]

const scoreGrouping = (Group[]) => {
    return randomGrouping.map(evaluateGroupByMultipleChoice).sum()
}

const formGroups: Algorithm = (targetGroupSize: number, registrations: Registration[]) {
    const randomGrouping: Group[] = createRandomGrouping(targetGroupSize, registrations)

    var score = scoreGrouping(randomGrouping)

    for (i = 0; i < ITERATIONS; i++) {
        const newGrouping = mutateGrouping(randomGrouping)
        
        if (scoreGrouping(newGrouping) > score) {
            score = scoreGrouping(newGrouping)
            randomGrouping = newGrouping
        }
    }
} */

// const evaluateGroupByWorkingHours = (group: Group): number