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
    user.workingTimesMap = generate_working_time(user);
    user.totalHours = find_total_hours(user.workingTimesMap);

  }


  // Compared users workingtimes dictionary to other users dictionary total overlap.
  for (const user of users) {
    for (const other_user of users) {
      if (user.studentNo === other_user.studentNo) {
        continue;
      }

      let overlapofhours = find_overlap_of_working_hours(user.workingTimesMap, other_user.workingTimesMap);
      user.bestMatches.push({ overlapofhours, other_user })

    }
  }

  // Sort users so we start looping through them from the direction that person with leasts marked hours is first.
  users.sort(function compare(a, b) {
    return a.totalHours - b.totalHours;
  });


  let resulting_groups = form_groups(users, targetGroupSize);
  print_group_information(resulting_groups);

  const result = resulting_groups.map(group => {
    return { userIds: group.map(u => u.id) }
  }) as GroupInput[];
  console.log(result);
  return result;
}


function print_group_information(groups) {
  let hours_avg = 0;
  let hours_min = 5555;
  for (const group of groups) {
    console.log('RYHMA');
    for (const user of group) {
      console.log(user.firstname, user.lastname);
    }
    let { hourly_overlap, day_hours } = find_common_hours_of_group(group);
    console.log("hours_overlapping:", hourly_overlap);
    if (hourly_overlap < hours_min) {
      hours_min = hourly_overlap
    }
    hours_avg += hourly_overlap;
    console.log("day_hours:", day_hours);
  }

  console.log(groups.length);

  console.log(hours_min);
  console.log(hours_avg / groups.length);

}

let mapping_dict = { '0': 11, '1': 5, '2': 6, '3': 7, '4': 8, '5': 9, '6': 10 };

function form_groups(users, groupsize) {
  let handled_users = [];
  let groups = [];
  let amount_of_ungrouped_people = users.length % groupsize;
  if (amount_of_ungrouped_people > 0) {
    let ungrouped_people = users.splice(0, amount_of_ungrouped_people);
    groups.push(ungrouped_people);
    ungrouped_people.forEach(u => {
      handled_users.push(u.id);
    });
  }
  for (const user of users) {
    if (handled_users.includes(user.id)) {
      continue;
    }
    let group = [];
    group.push(user);
    handled_users.push(user.id);

    user.bestMatches.sort(function compare(a, b) {
      return b.overlapofhours - a.overlapofhours
    });

    for (let match of user.bestMatches) {
      if (group.length === groupsize) {
        break
      }
      if (handled_users.includes(match.other_user.id)) {
        continue
      }
      group.push(match.other_user);
      handled_users.push(match.other_user.id);

    }

    groups.push(group)
  }

  return groups
}

function find_common_hours_of_group(listofusers) {
  let common_days = listofusers.map(user => Object.keys(user.workingTimesMap));
  let day_intersection = _.intersection(...common_days);

  let hourly_overlap = 0;
  let day_hours = {};
  for (const day of day_intersection) {
    let hours = listofusers.map(user => user.workingTimesMap[day]);
    let common_hours = _.intersection(...hours);
    day_hours[day] = common_hours;
    hourly_overlap += common_hours.length
  }
  return { hourly_overlap, day_hours }
}


function find_total_hours(workingTimesMap) {
  let totalhours = 0;
  let keys = Object.keys(workingTimesMap);
  for (const key of keys) {
    totalhours += workingTimesMap[key].length
  }
  return totalhours
}

function find_overlap_of_working_hours(workingTimesMap, otherWorkingTimesMap) {
  let first_keys = Object.keys(workingTimesMap);
  let second_keys = Object.keys(otherWorkingTimesMap); //console.log(otherWorkingTimesMap.keys());
  const common_keys = _.intersection(first_keys, second_keys);
  let overlap = 0;
  for (const key of common_keys) {
    let intersection_of_daily_hours = _.intersection(workingTimesMap[key], otherWorkingTimesMap[key]).length;
    overlap += intersection_of_daily_hours
  }
  return overlap
}

function generate_working_time(user) {
  let workingTimesMap = {};
  for (const workingTime of user.workingTimes) {
    const mapped_start_day = mapping_dict[workingTime.startTime.getDay()];
    const start_day_starting_hour = workingTime.startTime.getHours();
    const ending_hour = workingTime.endTime.getHours();

    if (!workingTimesMap.hasOwnProperty(mapped_start_day)) {
      workingTimesMap[mapped_start_day] = return_starting_hours_from_interval(start_day_starting_hour, ending_hour)
    } else {
      let new_list_of_hours = workingTimesMap[mapped_start_day].concat(return_starting_hours_from_interval(start_day_starting_hour, ending_hour));
      workingTimesMap[mapped_start_day] = new_list_of_hours
    }
  }

  return workingTimesMap

}


function return_starting_hours_from_interval(starttime, endtime) {
  const temp_arr = [];
  for (let x = starttime; x < endtime; x++) {
    temp_arr.push(x)
  }
  return temp_arr
}
