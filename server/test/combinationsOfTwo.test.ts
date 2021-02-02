import { iteratee } from "lodash";
import { combinationsOfTwo } from "../src/algorithm/evaluators/evaluateByMultipleChoice";

describe("pairCombinations", () => {

    it("returns an empty array given an empty array", () => {
        expect(combinationsOfTwo([])).toEqual([])
    })

    it("returns an empty array given [1]", () => {
        expect(combinationsOfTwo([1])).toEqual([])
    })

    it("returns [[1,2]] given [1,2]", () => {
        expect(combinationsOfTwo([1])).toEqual([])
    })

    it("returns [[1,2], [1,3], [2,3]] given [1,2,3]", () => {
        expect(combinationsOfTwo([1,2,3])).toEqual([[1,2], [1,3], [2,3]])
    })

    it("returns [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]] given [1,2,3,4]", () => {
        expect(combinationsOfTwo([1,2,3,4])).toEqual([[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]])
    })
})