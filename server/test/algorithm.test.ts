import _ from "lodash"
import { formGroups } from "../src/algorithm/algorithm"
import { Registration } from "../src/entities/Registration"
import { User } from "../src/entities/User"
import parseStudentNumber from "../src/utils/parseStudentNumber"

const createEmptyRegistration = (): Registration => {
    const reg = new Registration()
    reg.workingTimes = []
    reg.student = new User()
    reg.student.id = "0"
    return reg
}

describe("Algorithm", () => {
    it("with target group size of four, divides 12 people into groups of four evenly", () => {
        const groupSizes = formGroups(4, Array.from(Array(12), () => createEmptyRegistration())).map(
            group => group.userIds.length
        )
        expect(groupSizes).toEqual([4,4,4])
    })

    it("with target group size of four, divides 11 people into two groups of four and one group of three", () => {
        const groupSizes = formGroups(4, Array.from(Array(11), () => createEmptyRegistration())).map(
            group => group.userIds.length
        )
        expect(groupSizes).toEqual([4,4,3])
    })

    it("with target group size of four, divides 10 people into two groups of five", () => {
        const groupSizes = formGroups(4, Array.from(Array(10), () => createEmptyRegistration())).map(
            group => group.userIds.length
        )
        expect(groupSizes).toEqual([5,5])
    })

    it("with target group size of five, divides 87 people into two groups of six and 15 groups of five", () => {
        const groupSizes = formGroups(5, Array.from(Array(87), () => createEmptyRegistration())).map(
            group => group.userIds.length
        )
        expect(_.filter(groupSizes, x => x === 6).length).toEqual(2)
        expect(_.filter(groupSizes, x => x === 5).length).toEqual(15)
    })
})