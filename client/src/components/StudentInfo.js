import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';

export default () => {
  const [user] = useStore('userStore');
  console.log('user:', user);

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
          values={{ studentNo: user.studentNo }}
        />
      </div>
      <div>
        <FormattedMessage
          id="studentInfo.email"
          values={{ email: user.email }}
        />
      </div>
      {user.registrations ? (
        <div>
          <h3>
            <FormattedMessage id="studentInfo.course" />
          </h3>
          <ul>
            {user.registrations.filter((reg) => !reg.course.deleted).map((reg) => (
              <li key={reg.id}>
                {reg.course.title}
                {' '}
                {reg.course.code}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {user.groups ? (
      <div>
        <h3>
          <FormattedMessage id="studentInfo.group" />
        </h3>
        <ul>
          {user.groups.filter((group) => !group.course.deleted).map((group) => (
            <li key={group.id}>
              {group.course.title}
              <ul>
                {group.students.map((student) => (
                  <li key={student.id}>
                    {student.firstname}
                    {' '}
                    {student.lastname}
                    {' '}
                    {student.email}
                  </li>
                )) }
              </ul>
            </li>
          )) }
        </ul>
      </div>
    ) : null}
    </div>
  );
};
