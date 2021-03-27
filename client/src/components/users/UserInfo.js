import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import UserCourseList from './UserCourseList';

import { useUserInfoStyles } from '../../styles'
import { Card, CardContent, Container, Typography } from '@material-ui/core';

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

      <Card className={classes.root}>
        <CardContent>

          <Typography variant="h5" component="h2">
            <FormattedMessage
              id="studentInfo.fullname"
              values={{ fullname: `${user.firstname} ${user.lastname}` }}
            />
          </Typography>

          <Typography className={classes.pos} color="textSecondary">
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

        </CardContent>
      </Card>

      &nbsp;
      {user.registrations ? (
        <div>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.course" />
          </Typography>

          <UserCourseList courses={usersCourses()} user={user} />
        </div>
      ) : null}

      &nbsp;
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
