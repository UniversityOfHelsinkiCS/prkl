import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { GROUP_TIMES } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import { timeParse } from '../../util/functions';
import UserCourseList from './UserCourseList';

export default () => {
  const [user] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');
  const [groupTimes, setGroupTimes] = useState(undefined);

  const { loading, error, data } = useQuery(GROUP_TIMES, {
    skip: user.id === undefined,
    variables: { studentId: user.id },
  });

  useEffect(() => {
    if (!loading && data !== undefined ) {
      setGroupTimes(timeParse(data.groupTimes));
    }
  }, [data, loading]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const usersCourses = () => {
    const courses = user.registrations.map(reg => reg.course);

    return (
      courses
    )};


  return (
    <div>
      <h3>
        <FormattedMessage id="studentInfo.header" />
      </h3>
      <div>
        <FormattedMessage
          id="studentInfo.fullname"
          values={{ fullname: `${user.firstname} ${user.lastname}` }}
        />
      </div>

      <div>
        <FormattedMessage
          id="studentInfo.studentNo"
          values={{ studentNo: privacyToggle ? dummyStudentNumber : user.studentNo }}
        />
      </div>
      <div>
        <FormattedMessage
          id="studentInfo.email"
          values={{ email: privacyToggle ? dummyEmail : user.email }}
        />
      </div>
      &nbsp;
      {user.registrations ? (
        <div>
          <h3>
            <FormattedMessage id="studentInfo.course" />
          </h3>
          <UserCourseList courses={usersCourses()} user={user} />
        </div>
      ) : null}
    </div>
  );
};
