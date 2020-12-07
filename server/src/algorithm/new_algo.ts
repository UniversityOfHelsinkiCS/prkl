import "reflect-metadata";
import { Registration } from "../entities/Registration";
import { GroupInput } from '../inputs/GroupInput'

let _ = require("lodash");

export const formGroups = (targetGroupSize: number, registrations: Registration[]): GroupInput[] => {

  console.log("Loading users from the database...");
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

      let overlapOfHours = findOverlapOfWorkingHours(user.workingTimesMap, otherUser.workingTimesMap);
      user.bestMatches.push({ overlapOfHours, otherUser });

    }
  }

  // Sort users so we start looping through them from the direction that person with leasts marked hours is first.
  users.sort(function compare(a, b) {
    return a.totalHours - b.totalHours;
  });


  let resultingGroups = formNewGroups(users, targetGroupSize);
  printGroupInformation(resultingGroups);

  const result = resultingGroups.map(group => {
    return { userIds: group.map(u => u.id) }
  }) as GroupInput[];
  console.log('Groups are', result);
  return result;
}


function printGroupInformation(groups) {
  let hoursAvg = 0;
  let hoursMin = 5555;
  for (const group of groups) {
    console.log('GROUP');
    for (const user of group) {
      console.log(user.firstname, user.lastname);
    }
    let { hourlyOverlap, dayHours } = findCommonHoursOfGroup(group);
    console.log("hours overlapping:", hourlyOverlap);
    if (hourlyOverlap < hoursMin) {
      hoursMin = hourlyOverlap
    }
    hoursAvg += hourlyOverlap;
    console.log("day hours:", dayHours);
  }

  console.log('Groups in total', groups.length);

  console.log('Shortest common time slot', hoursMin);
  console.log('Average common hours', hoursAvg / groups.length);

}

let mappingDict = { '0': 11, '1': 5, '2': 6, '3': 7, '4': 8, '5': 9, '6': 10 };

function formNewGroups(users, groupsize) {
  let handledUers = [];
  let groups = [];
  let amountOfUngroupedPeople = users.length % groupsize;
  if (amountOfUngroupedPeople > 0) {
    let ungroupedPeople = users.splice(0, amountOfUngroupedPeople);
    groups.push(ungroupedPeople);
    ungroupedPeople.forEach(u => {
      handledUers.push(u.id);
    });
  }
  for (const user of users) {
    if (handledUers.includes(user.id)) {
      continue;
    }
    let group = [];
    group.push(user);
    handledUers.push(user.id);

    user.bestMatches.sort(function compare(a, b) {
      return b.overlapOfHours - a.overlapOfHours;
    });

    for (let match of user.bestMatches) {
      if (group.length === groupsize) {
        break;
      }
      if (handledUers.includes(match.otherUser.id)) {
        continue;
      }
      group.push(match.otherUser);
      handledUers.push(match.otherUser.id);
    }
    groups.push(group);
  }
  return groups;
}

function findCommonHoursOfGroup(listofusers) {
  let commonDays = listofusers.map(user => Object.keys(user.workingTimesMap));
  let dayIntersection = _.intersection(...commonDays);

  let hourlyOverlap = 0;
  let dayHours = {};
  for (const day of dayIntersection) {
    let hours = listofusers.map(user => user.workingTimesMap[day]);
    let commonHours = _.intersection(...hours);
    dayHours[day] = commonHours;
    hourlyOverlap += commonHours.length;
  }
  return { hourlyOverlap, dayHours };
}


function findTotalHours(workingTimesMap) {
  let totalhours = 0;
  let keys = Object.keys(workingTimesMap);
  for (const key of keys) {
    totalhours += workingTimesMap[key].length;
  }
  return totalhours;
}

function findOverlapOfWorkingHours(workingTimesMap, otherWorkingTimesMap) {
  let firstKeys = Object.keys(workingTimesMap);
  let secondKeys = Object.keys(otherWorkingTimesMap); //console.log(otherWorkingTimesMap.keys());
  const commonKeys = _.intersection(firstKeys, secondKeys);
  let overlap = 0;
  for (const key of commonKeys) {
    let intersectionOfDailyHours = _.intersection(workingTimesMap[key], otherWorkingTimesMap[key]).length;
    overlap += intersectionOfDailyHours;
  }
  return overlap;
}

function generateWorkingTime(user) {
  let workingTimesMap = {};
  for (const workingTime of user.workingTimes) {
    const mappedStartDay = mappingDict[workingTime.startTime.getDay()];
    const startDayStartingHour = workingTime.startTime.getHours();
    const endingHour = workingTime.endTime.getHours();

    if (!workingTimesMap.hasOwnProperty(mappedStartDay)) {
      workingTimesMap[mappedStartDay] = returnStartingHoursFromInterval(startDayStartingHour, endingHour)
    } else {
      let newListOfHours = workingTimesMap[mappedStartDay].concat(returnStartingHoursFromInterval(startDayStartingHour, endingHour));
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
