import React, { useState, useEffect } from 'react';
import { Table, Header, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { COURSE_GROUPS } from '../../GqlQueries';

export default ({ courseId }) => {
  const [groups, setGroups] = useState([]);

  const { loading, error, data } = useQuery(COURSE_GROUPS, {
    variables: { courseId },
  });

  useEffect(() => {
    if (!loading && data !== undefined) {
      const tempGroup = [];
      data.courseGroups.forEach(e => {
        tempGroup.push(e.students);
      });
      setGroups(tempGroup);
    }
  }, [data, loading]);

  if (error !== undefined) {
    console.log('error:', error);
    return <div>Error loading course</div>;
  }

  if (loading || !groups) {
    return <Loader active />;
  }

  return (
    <div>
      {groups.length === 0 ? (
        <div>
          <p />
          <Header as="h3" block>
            <FormattedMessage id="group.empty" />
          </Header>
        </div>
      ) : (
        <div>
          {groups.map((grop, index) => (
            <div key={index}>
              <p />
              <Header as="h3">
                <div>
                  <FormattedMessage id="group.title" /> {index + 1}:
                </div>
              </Header>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.name" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.studentNumber" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.email" />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {grop.map(student => (
                    <Table.Row key={student.id}>
                      <Table.Cell>
                        {student.firstname} {student.lastname}
                      </Table.Cell>
                      <Table.Cell>{student.studentNo}</Table.Cell>
                      <Table.Cell>{student.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
