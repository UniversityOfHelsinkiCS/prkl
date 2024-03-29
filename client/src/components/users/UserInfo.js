import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { CircularProgress, Container, Typography } from '@material-ui/core';
import { useLoaderStyle } from '../../styles/ui/Loader';
import { ALL_COURSES } from '../../GqlQueries';
import UserCourseList from './UserCourseList';
import roles from '../../util/userRoles';
import UserGroup from './UserGroup';
import AppContext from '../../AppContext';

export default () => {
  const loaderClass = useLoaderStyle();
  const { user } = useContext(AppContext);
  const { loading: courseLoading, error: courseError, data: courseData } = useQuery(ALL_COURSES);

  if (courseLoading || courseError !== undefined) {
    return <CircularProgress className={loaderClass.root} />;
  }

  const { courses } = courseData;

  const coursesTeachedOn = courses.filter(c => c.teachers.some(t => t.id === user.id));

  const usersCourses = () => {
    const coursesIds = user.registrations.map(reg => reg.course.id);
    return courses.filter(c => coursesIds.includes(c.id));
  };

  const divider = <span style={{ color: '#f2f2f2' }}>{' | '}</span>;

  return (
    <Container>
      <Typography variant="h4">
        <FormattedMessage
          id="studentInfo.fullname"
          values={{ fullname: `${user.firstname} ${user.lastname}` }}
        />
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        <FormattedMessage id="studentInfo.studentNo" values={{ studentNo: user.studentNo }} />
        {divider}
        <FormattedMessage id="studentInfo.email" values={{ email: user.email }} className />
      </Typography>
      &nbsp;
      {user.registrations ? (
        <>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.userCourses" />
          </Typography>

          <UserCourseList courses={usersCourses()} user={user} />
        </>
      ) : null}
      &nbsp;
      {user.role === roles.ADMIN_ROLE || user.role === roles.STAFF_ROLE ? (
        <>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.ownCourses" />
          </Typography>
          {coursesTeachedOn.length > 0 ? (
            <UserCourseList courses={coursesTeachedOn} user={user} />
          ) : (
            <>
              <Typography variant="h7" color="textSecondary" gutterBottom>
                <FormattedMessage id="studentInfo.noOwnCourses" />
              </Typography>
            </>
          )}
        </>
      ) : null}
      &nbsp;
      {user.groups ? (
        <>
          <Typography variant="h5" gutterBottom>
            <FormattedMessage id="studentInfo.group" />
          </Typography>

          {user.groups.map(group => {
            return <UserGroup user={user} course={group.course} />;
          })}
        </>
      ) : null}
    </Container>
  );
};
