import _ from "lodash";
import { Registration } from "../../entities/Registration";
import { Evaluator, Group } from "../algorithm";
import { combinationsOfTwo } from './evaluateByMultipleChoice';

type workingTimeObject = {
    startDay: number,
    startHour: number,
    endHour: number
}

type workingTimeList = {
    times: workingTimeObject[];
}

const evaluateByWorkingHours: Evaluator = (group: Group): number => {
    const uniquePairs = combinationsOfTwo(group);
    const scores = uniquePairs.map(scorePair)
    console.log('scores:', scores)
    const score = scores.reduce((sum, val) => sum + val, 0)
    return score
}

const scorePair = (pair: [Registration, Registration]): number => {

    const listForPair1: workingTimeObject[] = [];
    const listForPair2: workingTimeObject[] = [];

    const pairOneWorkingHours: workingTimeList = {
        times: listForPair1
    }

    const pairTwoWorkingHours: workingTimeList = {
        times: listForPair2
    }

    const list = [pairOneWorkingHours, pairTwoWorkingHours]

    for (var i = 0; i < pair.length; i++) {
        for (const workingTime of pair[i].workingTimes) {
            const startDay = workingTime.startTime.getDay();
            const startHour = workingTime.startTime.getHours();
            const endHour = workingTime.endTime.getHours();

            const times: workingTimeObject = {startDay, startHour, endHour}

            if (times.endHour - times.startHour > 1) {
                addMissingHoursBetweenStartAndEnd(list[i], times);
            } else {
                list[i].times.push(times)
            }
        }
    }

    // console.log('1: ',pairOneWorkingHours.times.length, pairOneWorkingHours.times)
    // console.log('2: ',pairTwoWorkingHours.times.length, pairTwoWorkingHours.times);

    let result = 0;
    for (const pairOne of pairOneWorkingHours.times) {
        for (const pairTwo of pairTwoWorkingHours.times) {
            if (pairOne.startDay === pairTwo.startDay) {
                if (pairOne.startHour === pairTwo.startHour) {
                    result += 1;
                }
            }
        }
    }

    console.log('RESULT: ' , result)

    if (Math.min(pairOneWorkingHours.times.length, pairTwoWorkingHours.times.length) !== 0) {
        result = result / Math.min(pairOneWorkingHours.times.length, pairTwoWorkingHours.times.length);
    } else {
        result = 0;
    }

    console.log('RESULT: ' , result)

    return result;
}

const addMissingHoursBetweenStartAndEnd = (array: workingTimeList, workDay: workingTimeObject): workingTimeList => {
    for (var i = workDay.startHour; i < workDay.endHour; i++) {
        const startDay = workDay.startDay;
        const startHour = i;
        const endHour = i + 1;
        const times: workingTimeObject = {startDay, startHour, endHour}
        array.times.push(times);
    }
    return array;
}

export default evaluateByWorkingHours;
