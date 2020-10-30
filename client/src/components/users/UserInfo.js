import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { GROUP_TIMES, CURRENT_USER } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import { timeParse } from '../../util/functions';
import GroupList from './UserGroups';

export default () => {
  const [user] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');
  const [groupTimes, setGroupTimes] = useState(undefined);

 /* const { loading: userLoading, data: userData } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only',
  });*/


  const { loading, error, data } = useQuery(GROUP_TIMES, {
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
      {user.registrations ? (
        <div>
          <h3>
            <FormattedMessage id="studentInfo.course" />
          </h3>
          <ul>
            {user.registrations
              .filter(reg => !reg.course.deleted)
              .map(reg => (
                <li key={reg.id}>
                  {reg.course.title}
                  {reg.course.code}
                </li>
              ))}
          </ul>
        </div>
      ) : null}
      {user.groups && groupTimes ? (
        <div>
          <h3>
            <FormattedMessage id="studentInfo.group" />
          </h3>
          {/*<GroupList groups={user.groups} groupTimes={groupTimes} />*/}
        </div>
      ) : null}
    </div>
  );
};
