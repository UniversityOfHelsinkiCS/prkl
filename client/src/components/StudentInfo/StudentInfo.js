import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { useQuery } from '@apollo/react-hooks';
import { GROUP_TIMES, CURRENT_USER } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import GroupList from './GroupList';

export default () => {
  const [user, setUser] = useStore('userStore');
  const [privacyToggle] = useStore('toggleStore');
  const [groupTimes, setGroupTimes] = useState(undefined);
  
  const { loading : userLoading, data : userData } = useQuery(CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  const { loading, error, data } = useQuery(GROUP_TIMES, {
    variables: { studentId: user.id },
  });

  const hours = 14;
  // joko 8 tai 6 riippuen timezonesta
  const first = 8;

  useEffect(() => {
    if (!loading && data !== undefined && !userLoading ) {
      setGroupTimes(timeParse(data.groupTimes));
      setUser(userData.currentUser);
    }
  }, [data, loading, userData, userLoading]);

  if (error !== undefined) {
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  const count = group => {
    const times = [...Array(7)].map(() => [...Array(hours)].map(() => 0));
    // console.log('times begin:', times)
    group.students.forEach(student => {
      student.registrations[0].workingTimes.forEach(time => {
        const start = new Date(time.startTime).getHours();
        const diff = new Date(time.endTime).getHours() - start;
        let day = new Date(time.startTime).getDay();

        // Tämä koska maanantai on 1 ja sunnuntai 0
        if (day === 0) {
          day = 7;
        }
        day--;

        if (diff >= 1) {
          for (let i = 0; i <= diff - 1; i++) {
            times[day][start - first + i]++;
          }
        }
      });
    });
    // console.log('times:', times)

    return times;
  };

  const timeParse = props => {
    const groupTimesMap = {};
    props.forEach(group => {
      groupTimesMap[group.id] = count(group);
    });
    return groupTimesMap;
  };

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
        <FormattedMessage id="studentInfo.studentNo" values={{ studentNo: privacyToggle ? dummyStudentNumber : user.studentNo }} />
      </div>
      <div>
        <FormattedMessage id="studentInfo.email" values={{ email: privacyToggle ? dummyEmail : user.email }} />
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
                  {reg.course.title} {reg.course.code}
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
          <GroupList groups={user.groups} groupTimes={groupTimes} />
        </div>
      ) : null}
    </div>
  );
};
