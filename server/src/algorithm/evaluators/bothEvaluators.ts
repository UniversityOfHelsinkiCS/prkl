import _ from "lodash";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";
import { combinationsOfTwo, multipleScorePair } from './evaluateByMultipleChoice';
import { hoursScorePair } from './evaluateByWorkingHours';

import { performance } from "perf_hooks";
export const evaluateBoth = (group: Group,start, end): number => {  
    const uniquePairs = combinationsOfTwo(group);   
    const hourScores = uniquePairs.map(hoursScorePair);
    const multipleScores = uniquePairs.map(multipleScorePair);
    let score = hourScores.reduce((sum, val) => sum + val, 0);
    score += multipleScores.reduce((sum, val) => sum + val, 0);
    return score;
}

export default evaluateBoth;