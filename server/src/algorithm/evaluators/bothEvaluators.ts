import { Group } from "../algorithm";
import { hoursScorePair } from "./evaluateByWorkingHours";
import { combinationsOfTwo, multipleScorePair } from "./evaluateByMultipleChoice";

export const evaluateBoth = (group: Group): number => {
  const uniquePairs = combinationsOfTwo(group);
  const hourScores = uniquePairs.map(hoursScorePair);
  const multipleScores = uniquePairs.map(multipleScorePair);
  let score = hourScores.reduce((sum, val) => sum + val, 0);
  score += multipleScores.reduce((sum, val) => sum + val, 0);
  return score;
};

export default evaluateBoth;
