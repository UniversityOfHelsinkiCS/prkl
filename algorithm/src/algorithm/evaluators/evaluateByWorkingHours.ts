import { combinationsOfTwo } from "./evaluateByMultipleChoice";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";

export type workingTimeObject = {
  startDay: number;
  startHour: number;
  endHour: number;
  handled: boolean;
};

export type workingTimeList = workingTimeObject[];

const evaluateByWorkingHours: Evaluator = (group: Group): number => {
  const uniquePairs = combinationsOfTwo(group);
  const scores = uniquePairs.map(hoursScorePair);
  return scores.reduce((sum, val) => sum + val, 0);
};

export const hoursScorePair = (pair: [Registration, Registration]): number => {
  const pairOneWorkingTimes = new Map<number, Set<workingTimeObject>>();
  const pairOneHelperMap = new Map<number, Set<number>>();
  const pairOneTotalHours: number[] = [];

  const pairTwoWorkingTimes = new Map<number, Set<workingTimeObject>>();
  const pairTwoHelperMap = new Map<number, Set<number>>();
  const pairTwoTotalHours: number[] = [];

  for (const workingTime of pair[0].workingTimes) {
    const startDay = new Date(workingTime.startTime).getDay();
    const startHour = new Date(workingTime.startTime).getHours();
    const endHour = new Date(workingTime.endTime).getHours();
    const workDay: workingTimeObject = { startDay, startHour, endHour, handled: false };

    if (!pairOneWorkingTimes.has(startDay)) {
      pairOneWorkingTimes.set(startDay, new Set<workingTimeObject>());
      pairOneHelperMap.set(startDay, new Set<number>());
    }
    allWorkingHours(pairOneWorkingTimes, pairOneHelperMap, pairOneTotalHours, workDay);
  }

  let result = 0;

  for (const workingTime of pair[1].workingTimes) {
    const startDay = new Date(workingTime.startTime).getDay();
    const startHour = new Date(workingTime.startTime).getHours();
    const endHour = new Date(workingTime.endTime).getHours();
    const workDay: workingTimeObject = { startDay, startHour, endHour, handled: false };

    if (!pairTwoWorkingTimes.has(startDay)) {
      pairTwoWorkingTimes.set(startDay, new Set<workingTimeObject>());
      pairTwoHelperMap.set(startDay, new Set<number>());
    }

    allWorkingHours(pairTwoWorkingTimes, pairTwoHelperMap, pairTwoTotalHours, workDay);
    if (pairOneWorkingTimes.has(startDay)) {
      pairTwoWorkingTimes.get(startDay).forEach((startHour) => {
        if (pairOneHelperMap.get(startDay).has(startHour.startHour) && startHour.handled === false) {
          result += 1;
          startHour.handled = true;
        }
      });
    }
  }

  if (Math.min(pairOneTotalHours.length, pairTwoTotalHours.length) !== 0) {
    result = result / Math.min(pairOneTotalHours.length, pairTwoTotalHours.length);
  } else {
    result = 0;
  }
  return result;
};

const allWorkingHours = (
  map: Map<number, Set<workingTimeObject>>,
  helperMap: Map<number, Set<number>>,
  totalHours: number[],
  workDay: workingTimeObject,
): Map<number, Set<workingTimeObject>> => {
  for (let i = workDay.startHour; i < workDay.endHour; i++) {
    const startDay = workDay.startDay;
    const startHour = i;
    const endHour = i + 1;
    const times: workingTimeObject = { startDay, startHour, endHour, handled: false };
    if (!helperMap.get(startDay).has(i)) {
      helperMap.get(startDay).add(i);
      map.get(workDay.startDay).add(times);
      totalHours.push(i);
    }
  }

  return map;
};

export default evaluateByWorkingHours;
