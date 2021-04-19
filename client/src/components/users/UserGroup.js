import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/client';

import { timeParse } from '../../util/functions';
import { GROUP_TIMES } from '../../GqlQueries';
import UserGroupItem from './UserGroupItem';
import { Box, Paper, Typography } from '@material-ui/core';

import { useUserGroupStyles } from '../../styles/users/UserGroup.js';

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

  const classes = useUserGroupStyles();

  return (
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      {userIsRegistered() ? (
        courseHasGroups() ? (
          <>
            {group[0].groupMessage && group[0].groupMessage !== '' && (
              <Box component={Paper} width="50%" m={2} p={2}>
                <Typography variant="h5" gutterBottom>
                  <FormattedMessage id="groups.newMessage" />
                </Typography>
                <Typography variant="body1">
                  {group[0].groupMessage}
                </Typography>
              </Box>
            )}
            <Typography variant="h4" gutterBottom>
              <FormattedMessage id="groups.published" />
            </Typography>
            <UserGroupItem group={group[0]} groupTimes={groupTimes} />
          </>
        ) : null
      ) : null}
    </>
  );
};
