import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Header, Button, Loader } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';
import { GROUP_TIMES, CURRENT_USER } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import { timeParse } from '../../util/functions';
import GroupList from './UserGroups';
import UserGroupItem from './UserGroupItem';
import GroupItem from './UserGroupItem'

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

  console.log(groupTimes)

  return (
    <div>
      {courseHasGroups() ? (
      <div>
        <Header as="h4">
          <FormattedMessage id="groups.published" />
        </Header>
        <UserGroupItem group={group[0]} groupTimes={groupTimes} />
      </div>
      ) : (
        <div>
          <Header as="h4">
            <FormattedMessage id="groups.notPublished" />
          </Header>
        </div>
      )}
    </div>
  );
};
