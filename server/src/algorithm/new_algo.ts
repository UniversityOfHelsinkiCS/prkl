import "reflect-metadata";
import { Registration } from "../entities/Registration";
import { GroupInput } from '../inputs/GroupInput';
let _ = require("lodash");

export const formGroups = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {

  //console.log("Loading users from the database...");
  //const users = await connection.manager.find(User);
  //console.log("Loaded users: ", users);
  //const courses = await connection.manager.find(Course);
  // Map users and their working times to objects to be managed.
  let users = registrations.map(user => {
    return ({
      'id': user.student.id,
      'shibbolethUid': user.student.shibbolethUid,
      'role': user.student.role,
      'firstname': user.student.firstname,
      'lastname': user.student.lastname,
      'studentNo': user.student.studentNo,
      'email': user.student.email,
      'workingTimes': user.workingTimes,
      'workingTimesMap': {},
      'totalHours': 0,
      'bestMatches': [],
    })
  });
  // Generate total hours and workingtime dictionary.
  for (const user of users) {
    user.workingTimesMap = generateWorkingTime(user);
    user.totalHours = findTotalHours(user.workingTimesMap);
  }

  // Compared users workingtimes dictionary to other users dictionary total overlap.
  for (const user of users) {
    for (const otherUser of users) {
      if (user.studentNo === otherUser.studentNo) {
        continue;
      }

      const overlapOfHours = findOverlapOfWorkingHours(user.workingTimesMap, otherUser.workingTimesMap);
      user.bestMatches.push({ overlapOfHours, otherUser });
    }
  }

  // Sort users so we start looping through them from the direction that person with leasts marked hours is first.
  users.sort(function compare(a, b) {
    return a.totalHours - b.totalHours;
  });
  const resultingGroups = formNewGroups(users, targetGroupSize);
  printGroupInformation(resultingGroups);

  const result = resultingGroups.map(group => {
    return { userIds: group.map(u => u.id) };
  }) as GroupInput[];
  console.log('Groups are', result);
  return result;
};

function filterTooLittleHoursChosen(users, minHours) {
  return users.filter(user => user.totalHours <= minHours);
}

function sortByTotalHoursAndShuffleBrackets(bestMatches) {
  // Sort so other students with most overlap are first.
  bestMatches.sort(function compare(a, b) {
    return b.overlapOfHours - a.overlapOfHours;
  });

  const sublists = [];
  // Find different brackets of overlapping hours.
  const differentOverlaps = bestMatches.map(user => user.overlapOfHours);
  // Get unique ones.
  const disctinct = (Array.from(new Set(differentOverlaps)));

  // Makes sublists with people in same brackets and shuffle them.
  for (const overLap of disctinct) {
    sublists.push(_.shuffle(bestMatches.filter(user => user.overlapOfHours === overLap)));
  }
  // Flatten the list
  const sortedAndShuffledBestMatches = _.flatten(sublists);

  return sortedAndShuffledBestMatches;
}

function printGroupInformation(groups) {
  let hoursAvg = 0;
  let hoursMin = 5555;
  for (const group of groups) {
    console.log('GROUP');
    for (const user of group) {
      console.log(user.firstname, user.lastname);
    }
    const { hourlyOverlap, dayHours } = findCommonHoursOfGroup(group);
    console.log("hours overlapping:", hourlyOverlap);
    if (hourlyOverlap < hoursMin) {
      hoursMin = hourlyOverlap;
    }
    hoursAvg += hourlyOverlap;
    console.log("day hours:", dayHours);
  }

  console.log('Groups in total', groups.length);

  console.log('Shortest common time slot', hoursMin);
  console.log('Average common hours', hoursAvg / groups.length);

}

const mappingDict = { "0": 11, "1": 5, "2": 6, "3": 7, "4": 8, "5": 9, "6": 10 };

function formNewGroups(users, groupsize) {
  const handledUsers = [];
  const groups = [];
  const rejektiRyhma = [];

  const tooFewHours = filterTooLittleHoursChosen(users, 20);
  //console.log("Too few hours:", tooFewHours);
  if (tooFewHours.length >= 0) {
    rejektiRyhma.push(...tooFewHours);
    tooFewHours.forEach(u => {
      handledUsers.push(u.id);
    });
  }

  const amountOfUngroupedPeople = (users.length - tooFewHours.length) % groupsize;
  //console.log({amountOfUngroupedPeople});
  if (amountOfUngroupedPeople >= 0) {
    const ungroupedPeople = users.filter(user => !handledUsers.includes(user.id)).splice(0, amountOfUngroupedPeople);
    //console.log({ungroupedPeople});
    rejektiRyhma.push(...ungroupedPeople);
    ungroupedPeople.forEach(u => {
      handledUsers.push(u.id);
    });
  }

  for (const user of users) {
    if (handledUsers.includes(user.id)) {
      continue;
    }
    const group = [];
    group.push(user);
    handledUsers.push(user.id);

    user.bestMatches.sort(function compare(a, b) {
      return b.overlapOfHours - a.overlapOfHours;
    });
    //user.bestMatches = sortByTotalHoursAndShuffleBrackets(user.bestMatches);
    for (const match of user.bestMatches) {
      if (group.length === groupsize) {
        break;
      }
      if (handledUsers.includes(match.otherUser.id)) {
        continue;
      }
      group.push(match.otherUser);
      handledUsers.push(match.otherUser.id);
    }
    groups.push(group);
  }

  groups.push(rejektiRyhma);
  return groups;
}

function findCommonHoursOfGroup(listofusers) {
  const commonDays = listofusers.map(user => Object.keys(user.workingTimesMap));
  const dayIntersection = _.intersection(...commonDays);

  let hourlyOverlap = 0;
  const dayHours = {};
  for (const day of dayIntersection) {
    const hours = listofusers.map(user => user.workingTimesMap[day]);
    const commonHours = _.intersection(...hours);
    dayHours[day] = commonHours;
    hourlyOverlap += commonHours.length;
  }
  return { hourlyOverlap, dayHours };
}

function findTotalHours(workingTimesMap) {
  let totalhours = 0;
  const keys = Object.keys(workingTimesMap);
  for (const key of keys) {
    totalhours += workingTimesMap[key].length;
  }
  return totalhours;
}

function findOverlapOfWorkingHours(workingTimesMap, otherWorkingTimesMap) {
  const firstKeys = Object.keys(workingTimesMap);
  const secondKeys = Object.keys(otherWorkingTimesMap); //console.log(otherWorkingTimesMap.keys());
  const commonKeys = _.intersection(firstKeys, secondKeys);
  let overlap = 0;
  for (const key of commonKeys) {
    const intersectionOfDailyHours = _.intersection(workingTimesMap[key], otherWorkingTimesMap[key]).length;
    overlap += intersectionOfDailyHours;
  }
  return overlap;
}

function generateWorkingTime(user) {
  const workingTimesMap = {};
  for (const workingTime of user.workingTimes) {
    const mappedStartDay = mappingDict[workingTime.startTime.getDay()];
    const startDayStartingHour = workingTime.startTime.getHours();
    const endingHour = workingTime.endTime.getHours();

    if (!workingTimesMap.hasOwnProperty(mappedStartDay)) {
      workingTimesMap[mappedStartDay] = returnStartingHoursFromInterval(startDayStartingHour, endingHour);
    } else {
      const newListOfHours = workingTimesMap[mappedStartDay].concat(returnStartingHoursFromInterval(startDayStartingHour, endingHour));
      workingTimesMap[mappedStartDay] = newListOfHours;
    }
  }
  return workingTimesMap;
}

function returnStartingHoursFromInterval(startTime, endTime) {
  const tempArr = [];
  for (let x = startTime; x < endTime; x++) {
    tempArr.push(x);
  }
  return tempArr;
}
