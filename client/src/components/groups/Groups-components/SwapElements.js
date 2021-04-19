import _ from 'lodash';

const swapElements = (
  fromIndex,
  toIndex,
  fromTable,
  toTable,
  groups,
  setGroups,
  setGroupsUnsaved
) => {
  if (fromTable === toTable) {
    return;
  }
  const newGroups = _.cloneDeep(groups);
  const removed = newGroups[fromTable].students.splice(fromIndex, 1);

  newGroups[toTable].students.splice(toIndex, 0, removed[0]);
  if (newGroups[fromTable].length === 0) {
    newGroups.splice(fromTable, 1);
  }
  setGroups(newGroups);
  setGroupsUnsaved(true);
};

export default swapElements;
