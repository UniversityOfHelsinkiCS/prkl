import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import UserCourseList from './UserCourseList';

export default () => {
  const [user] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');

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
