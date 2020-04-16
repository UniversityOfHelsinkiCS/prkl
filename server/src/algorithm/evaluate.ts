const enoughAvalableTimes = (data: object, group: string[], treshold: number): boolean => {
  let timeslots = 0;
  const groupTimes = new Array();
  group.forEach(student => groupTimes.push(data[student].times));

  for (let i = 0; i < groupTimes[0].length; i++) {
    let found = true;

    for (let j = 0; j < group.length; j++) {
      if (groupTimes[j][i] < 10) {
        found = false;
        break;
      }
    }
    if (found === true) {
      timeslots++;
      if (timeslots >= treshold) {
        return true;
      }
    }
  }

  return false;
};

export const evaluateGroup = (data: object, group: string[], minTime: number): number => {
  if (enoughAvalableTimes(data, group, minTime)) {
    return 100;
  } else {
    return 0;
  }
};

export const evaluateGroups = (data: object, groups: string[][], minTime: number): number => {
  return groups.reduce((a, b) => a + evaluateGroup(data, b, minTime), 0);
};
