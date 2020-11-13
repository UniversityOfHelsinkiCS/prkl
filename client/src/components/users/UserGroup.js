import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Header } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
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
    if (!loading && data !== undefined ) {
      setGroupTimes(timeParse(data.groupTimes));
    }

    if (user.groups && course.id) {
      setGroup(user.groups.filter(g => g.course.id === course.id));
    }

  }, [data, loading, user, course]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const courseHasGroups = () => {
    if (!group[0] || !groupTimes) {
      return false;
    }
    return true;
  }

  const userIsRegistered = () => {
    const found = user.registrations?.find(r => r.course.id === course.id);

    if (found === undefined) {
      return false;
    }
    return true;
  };

  return (
    <div>
      {userIsRegistered() ? (
        courseHasGroups() ? (
          <div>
            <UserGroupItem group={group[0]} groupTimes={groupTimes} />
          </div>
        ) : null)
      : null}
    </div>
  );
};
