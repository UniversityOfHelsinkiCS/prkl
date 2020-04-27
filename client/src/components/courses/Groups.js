import React from 'react';
import { useStore } from 'react-hookstore';
import { Table, Header, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { GENERATE_GROUPS } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import DraggableRow from './DraggableRow';
import questionSwitch from "../../util/functions"

export default ({ course, regByStudentId }) => {
  const [privacyToggle] = useStore('toggleStore');
  const [groups, setGroups] = useStore('groupsStore');

  const [generateGroups] = useMutation(GENERATE_GROUPS);

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
        groupObject.push({ userIds: group.map(userObject => userObject.id) });
      }
    });

    const dataObject = { data: { courseId: course.id, groups: groupObject } };
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
                    {course.questions.map(question =>
                      question.questionType !== 'times' ? (
                        <Table.HeaderCell key={question.id}>{question.content}</Table.HeaderCell>
                      ) : null
                    )}
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
                      <Table.Cell>{`${student.firstname} ${student.lastname}`}</Table.Cell>
                      <Table.Cell>
                        {privacyToggle ? dummyStudentNumber : student.studentNo}
                      </Table.Cell>
                      <Table.Cell>{privacyToggle ? dummyEmail : student.email}</Table.Cell>
                      {regByStudentId[student.studentNo].questionAnswers.map(qa => questionSwitch(qa))}
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
