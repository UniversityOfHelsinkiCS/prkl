import React from 'react';
import GroupItem from './UserGroupItem'

export default ({ groups, groupTimes }) => {

  return (
    <div>
      {groups
        .filter(group => !group.course.deleted)
        .map((group, index) => (
          <GroupItem key={index} group = { group } groupTimes={ groupTimes } />
        ))}
    </div>
  );
};
