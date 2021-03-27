import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import UserCourseList from './UserCourseList';

import { useUserInfoStyles } from '../../styles'
import { Container, Typography } from '@material-ui/core';

export default () => {
  const [user] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');

  const classes = useUserInfoStyles();
  const divider = <span style={{ color: '#f2f2f2' }}>{' | '}</span>

  const usersCourses = () => {
    const courses = user.registrations.map(reg => reg.course);
    return (
      courses
    )};

  return (
    <Container>

          <Typography variant="h4">

            <FormattedMessage
              id="studentInfo.fullname"
              values={{ fullname: `${user.firstname} ${user.lastname}` }}
            />

          </Typography>

          <Typography variant="h5" color="textSecondary" gutterBottom>

            <FormattedMessage
              id="studentInfo.studentNo"
              values={{ studentNo: privacyToggle ? dummyStudentNumber : user.studentNo }}
            />{divider}
            <FormattedMessage
              id="studentInfo.email"
              values={{ email: privacyToggle ? dummyEmail : user.email }}
              className
            />

          </Typography>

      &nbsp;
      {user.registrations ? (
        <div>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.course" />
          </Typography>

          <UserCourseList courses={usersCourses()} user={user} />
        </div>
      ) : null}

      {/*user.ownCourses ? (
        <div>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.ownCourses" />
          </Typography>

          <UserCourseList courses={usersOwnCourses()} user={user} />
        </div>
      ) : null*/}

    </Container>
  );
};
