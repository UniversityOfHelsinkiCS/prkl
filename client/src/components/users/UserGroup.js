import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/client';
import { GROUP_TIMES } from '../../GqlQueries';
import { timeParse } from '../../util/functions';
import UserGroupItem from './UserGroupItem';

export default ({ user, course }) => {
  const [groupTimes, setGroupTimes] = useState(undefined);
  const [group, setGroup] = useState([]);

  const { loading, error, data } = useQuery(GROUP_TIMES, {
    variables: { studentId: user.id },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      setGroupTimes(timeParse(data.groupTimes));
    }

    if (user.groups && course.id) {
      setGroup(user.groups.filter(g => g.course.id === course.id));
    }
  }, [data, loading, user, course]);

  if (error !== undefined) {
    // eslint-disable-next-line no-console
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const courseHasGroups = () => {
    return !(!group[0] || !groupTimes);
  };

  const userIsRegistered = () => {
    const found = user.registrations?.find(r => r.course.id === course.id);
    return found !== undefined;
  };

  return (
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      {userIsRegistered() && courseHasGroups() && (
        <>
          <UserGroupItem group={group[0]} groupTimes={groupTimes} course={course} />
          <br />
        </>
      )}
    </>
  );
};
