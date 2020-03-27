import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { COURSE_GROUPS, GENERATE_GROUPS } from '../../GqlQueries';
import DraggableRow from './DraggableRow';

export default ({ courseId }) => {
  const [groups, setGroups] = useState([]);

  const { loading, error, data } = useQuery(COURSE_GROUPS, {
    variables: { courseId },
  });

  const [generateGroups] = useMutation(GENERATE_GROUPS);

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
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
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

  const removeGroupButton = index => {
    if (groups.length > 1 && groups[index].length === 0) {
      return (
        <Button style={{ marginLeft: 10 }} color="red" onClick={() => removeGroup(index)}>
          <FormattedMessage id="groups.removeGroupButton" />
        </Button>
      );
    }
    return null;
  };

  const addGroupButton = () => {
    if (groups.length !== 0) {
      return (
        <Button style={{ marginTop: 15 }} color="green" onClick={() => addGroup()}>
          <FormattedMessage id="groups.addGroupButton" />
        </Button>
      );
    }
    return null;
  };
  const handleGroupCreation = () => {
    const groupObject = [];
    groups.forEach(group => {
      if (group.length > 0) {
        groupObject.push({ userIds: group.map(user => user.id) });
      }
    });

    const dataObject = { data: { courseId, groups: groupObject } };
    try {
      generateGroups({ variables: dataObject });
    } catch (generationError) {
      console.log('error generating groups:', generationError);
    }
  };

  const swapElements = (fromIndex, toIndex, fromTable, toTable) => {
    const newGroups = [...groups];
    const removed = newGroups[fromTable].splice(fromIndex, 1);

    newGroups[toTable].splice(toIndex, 0, removed[0]);
    if (newGroups[fromTable].length === 0) {
      newGroups.splice(fromTable, 1);
    }
    setGroups(newGroups);
    handleGroupCreation();
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
            <FormattedMessage id="groups.empty" />
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
                  <FormattedMessage id="groups.title" />
                  {tableIndex + 1}
                  {removeGroupButton(tableIndex)}
                </div>
              </Header>
              <Table singleLine fixed>
                <Table.Header>
                  <DraggableRow action={swapElements} index={0} tableIndex={tableIndex}>
                    <Table.HeaderCell>
                      <FormattedMessage id="groups.name" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="groups.studentNumber" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="groups.email" />
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
      <div>{addGroupButton()}</div>
    </div>
  );
};
