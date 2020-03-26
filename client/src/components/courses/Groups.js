import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { COURSE_GROUPS } from '../../GqlQueries';
import DraggableRow from './DraggableRow';

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
      console.log('data:', data);
      console.log('tempGroup:', tempGroup);
      setGroups(tempGroup);
    }
  }, [data, loading]);

  if (error !== undefined) {
    console.log('error:', error);
    return <div>Error loading course</div>;
  }

  const addGroup = () => {
    const newGroups = [...groups];
    newGroups.push([]);
    setGroups(newGroups);
  };

  const removeGroup = index => {
    const newGroups = [...groups];
    newGroups.splice(index, 1);
    setGroups(newGroups);
  };

  const removeButton = index => {
    if (groups.length > 1 && groups[index].length === 0) {
      return (
        <Button style={{ marginLeft: 10 }} color="red" onClick={() => removeGroup(index)}>
          Remove group
        </Button>
      );
    }
    return null;
  };

  const swapElements = (fromIndex, toIndex, fromTable, toTable) => {
    const newGroups = [...groups];
    const removed = newGroups[fromTable].splice(fromIndex, 1);
    newGroups[toTable].splice(toIndex, 0, removed[0]);
    setGroups(newGroups);
  };

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
          {groups.map((grop, tableIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`Group-${tableIndex}`}>
              <p />
              <Header as="h3">
                <div>
                  <FormattedMessage id="group.title" />
                  {tableIndex + 1}
                  {removeButton(tableIndex)}
                </div>
              </Header>
              <Table singleLine fixed>
                <Table.Header>
                  <DraggableRow action={swapElements} index={0} tableIndex={tableIndex}>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.name" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.studentNumber" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="group.email" />
                    </Table.HeaderCell>
                  </DraggableRow>
                </Table.Header>
                <Table.Body>
                  {grop.map((student, rowIndex) => (
                    <DraggableRow
                      key={student.id}
                      action={swapElements}
                      index={rowIndex}
                      tableIndex={tableIndex}
                    >
                      <Table.Cell>
                        {student.firstname} {student.lastname}
                      </Table.Cell>
                      <Table.Cell>{student.studentNo}</Table.Cell>
                      <Table.Cell>{student.email}</Table.Cell>
                    </DraggableRow>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </div>
      )}
      <Button style={{ marginTop: 15 }} color="green" onClick={() => addGroup()}>
        Add group
      </Button>
    </div>
  );
};
