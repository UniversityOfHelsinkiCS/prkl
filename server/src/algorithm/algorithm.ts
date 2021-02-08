import { Registration } from "../entities/Registration";
import { GroupInput } from "../inputs/GroupInput";
import * as _ from "lodash";

import evaluateGroupByMultipleChoice from "./evaluators/evaluateByMultipleChoice";
import evaluateGroupByWorkingHours from "./evaluators/evaluateByWorkingHours";

export type Algorithm = (targetGroupSize: number, registrations: Registration[]) => GroupInput[]

export type Evaluator = (group: Group) => number

export type Group = Registration[]

export type Grouping = Group[]

const sum = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0)


// PSEUDOCODE

const EVALUATORS = [
    [evaluateGroupByMultipleChoice, evaluateGroupByWorkingHours]
]

const ITERATIONS = 200

const scoreGrouping = (grouping: Grouping) => {
    return sum(grouping.map(evaluateGroupByWorkingHours))
}

// TODO: refactoring
const scoreGroupingByChoices = (grouping: Grouping) => {
    return sum(grouping.map(evaluateGroupByMultipleChoice))
}

// TODO: refactoring
export const formGroupsByMultiple: Algorithm = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {
    let grouping: Group[] = createRandomGrouping(targetGroupSize, registrations)
    let score = scoreGroupingByChoices(grouping)

    for (let i = 0; i < ITERATIONS; i++) {
        const newGrouping = mutateGrouping(grouping)

        if (scoreGroupingByChoices(newGrouping) > score) {
            score = scoreGroupingByChoices(newGrouping)
            grouping = newGrouping
        }
    }

    console.log("Final grouping score: " + score)

    return grouping.map(group => ({userIds: group.map(registration => registration.student.id)}) as GroupInput)
}

export const formGroups: Algorithm = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {
    let grouping: Group[] = createRandomGrouping(targetGroupSize, registrations)
    let score = scoreGrouping(grouping)

    for (let i = 0; i < ITERATIONS; i++) {
        const newGrouping = mutateGrouping(grouping)

        if (scoreGrouping(newGrouping) > score) {
            score = scoreGrouping(newGrouping)
            grouping = newGrouping
        }
    }

    console.log("Final grouping score: " + score)

    return grouping.map(group => ({userIds: group.map(registration => registration.student.id)}) as GroupInput)
}

const createRandomGrouping = (targetGroupSize: number, registrations: Registration[]) => {
    const shuffled = _.shuffle(registrations)
    const groups = _.chunk(shuffled, targetGroupSize)
    return groups
}

const mutateGrouping = (grouping: Grouping) => {
    if (grouping.length < 2) {
        return grouping
    }

    const groupsToSwapFrom = _.sampleSize(grouping, 2)
    const rest = _.without(grouping, ...groupsToSwapFrom)

    const group1User = _.sample(groupsToSwapFrom[0])
    const group1Rest = _.without(groupsToSwapFrom[0], group1User)

    const group2User = _.sample(groupsToSwapFrom[1])
    const group2Rest = _.without(groupsToSwapFrom[1], group2User)

    return [...rest, group2Rest.concat(group1User), group1Rest.concat(group2User)]
}