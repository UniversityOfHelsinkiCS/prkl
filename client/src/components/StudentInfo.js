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
    </div>
  );
};
