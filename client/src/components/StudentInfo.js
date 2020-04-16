import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStore } from 'react-hookstore';
import { Table, Header } from 'semantic-ui-react';
import { dummyEmail, dummyStudentNumber } from '../util/privacyDefaults';
import { useQuery } from '@apollo/react-hooks'
import { GROUP_TIMES } from '../GqlQueries';


const GroupList = props => {
  const [privacyToggle] = useStore('toggleStore');
  return (
    <div>
      {props.groups
        .filter(group => !group.course.deleted)
        .map(group => (
          <div key={group.id}>
            <Header as="h3" block>
              {group.course.title}
            </Header>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <FormattedMessage id="courseRegistration.firstName" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id="courseRegistration.lastName" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id="courseRegistration.email" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {group.students.map(student => (
                  <Table.Row key={student.id}>
                    <Table.Cell>{student.firstname}</Table.Cell>
                    <Table.Cell>{student.lastname}</Table.Cell>
                    <Table.Cell>{privacyToggle ? dummyEmail : student.email}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <p />
          </div>
        ))}
    </div>
  );
};

export default () => {
  const [user] = useStore('userStore');
  // const {getGroupTimes} = useQuery(GROUP_TIMES);
  // const [groupTimes, setGroupTimes] = useState({});

  // const { loading, error, data } = useQuery(GROUP_TIMES, {
  //   variables: { groupId: "", courseId: "" }
  // });

  // useEffect(() => {
  //   if (!loading && data !== undefined) {
  //     setGroupTimes(data);
  //   }
  // }, [data, loading]);

  // console.log("user", user)

  // if (error !== undefined) {
  //   console.log('error:', error);
  //   return (
  //     <div>
  //       <FormattedMessage id="groups.loadingError" />
  //     </div>
  //   );
  // }

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
        <FormattedMessage id="studentInfo.studentNo" values={{ studentNo: user.studentNo }} />
      </div>
      <div>
        <FormattedMessage id="studentInfo.email" values={{ email: user.email }} />
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
      {user.groups ? (
        <div>
          <h3>
            <FormattedMessage id="studentInfo.group" />
          </h3>
          <GroupList groups={user.groups} />
        </div>
      ) : null}
    </div>
  );
};
