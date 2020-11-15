import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { Table, Header, List, Button, Segment, Grid, Popup, Input } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { GENERATE_GROUPS } from '../../GqlQueries';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import DraggableRow from './DraggableRow';
import questionSwitch, { count } from '../../util/functions';
import HourDisplay from '../misc/HourDisplay';
import _ from 'lodash';

export default ({ course, regByStudentId, groupMessages, setGroupMessages }) => {
  const [privacyToggle] = useStore('toggleStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [groups, setGroups] = useStore('groupsStore');

  //const [generateGroups] = useMutation(GENERATE_GROUPS);

  const [showGroupTimes, setShowGroupTimes] = useState([]);
  const [groupTimesVisible, setGroupTimesVisible] = useState(false);

  useEffect(() => {
    if (groups.length > 0) {
      setShowGroupTimes(Array(groups.length).fill(false));
    }
  }, [groups]);

  const setUnsaved = () => {
    // To prevent unnecessary refreshes
    if (!groupsUnsaved) {
      setGroupsUnsaved(true);
    }
  }

  const handleGroupMessageChange = (e, index) => {
    const newGroupMsgs = [ ...groupMessages ];
    newGroupMsgs[index] = e.target.value;
    setGroupMessages(newGroupMsgs);
    setUnsaved();
  };

  const addGroup = () => {
    const newGroups = _.cloneDeep(groups);
    newGroups.push({
      students: [],
      groupMessage: ''
    });
    setGroups(newGroups);

    const newGroupMsgs = [ ...groupMessages ];
    newGroupMsgs.push('');
    setGroupMessages(newGroupMsgs);

    setShowGroupTimes(showGroupTimes.push(false));

    setGroupsUnsaved(true);
  };

  const removeGroup = index => {
    const newGroups = _.cloneDeep(groups);
    newGroups.splice(index, 1);
    setGroups(newGroups);

    const newGroupMsgs = [ ...groupMessages ];
    newGroupMsgs.splice(index, 1);
    setGroupMessages(newGroupMsgs);

    const newShowGroups = [...showGroupTimes];
    newShowGroups.splice(index, 1);
    setShowGroupTimes(newShowGroups);
    
    setGroupsUnsaved(true);
  };

  const removeGroupButton = index => {
    if (groups.length > 1 && groups[index].students.length === 0) {
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

  const swapElements = (fromIndex, toIndex, fromTable, toTable) => {
    const newGroups = _.cloneDeep(groups);
    const removed = newGroups[fromTable].students.splice(fromIndex, 1);

    newGroups[toTable].students.splice(toIndex, 0, removed[0]);
    if (newGroups[fromTable].length === 0) {
      newGroups.splice(fromTable, 1);
    }
    setGroups(newGroups);
    setGroupsUnsaved(true);
  };

  const handleShowGroupTimesClick = index => {
    setGroupTimesVisible(!groupTimesVisible);
    let newShowTimes = [...showGroupTimes];
    newShowTimes[index] = !newShowTimes[index];
    setShowGroupTimes(newShowTimes);
  };

  const popupTimesDisplay = (student) => (
    <HourDisplay
      groupId={student.id}
      header={`${student.firstname} ${student.lastname}`}
      students={1}
      times={count([regByStudentId[student.studentNo]])}
    />
  )

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
          {groups.map((grop, tableIndex) => {
            
            return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`Group-${tableIndex}`}>
              <p />
              <Header as="h3">
                <div>
                  <FormattedMessage id="groups.title" />
                  {tableIndex + 1}
                  <Input
                    fluid
                    label="Message: "
                    placeholder="Your message here..."
                    value={groupMessages[tableIndex] || ''}
                    onChange={e => handleGroupMessageChange(e, tableIndex)}
                  />
                </div>
              </Header>
              <div>
                <Button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleShowGroupTimesClick(tableIndex)}
                    disabled={ !course.questions.some(q => q.questionType === 'times') }
                    >
                    <FormattedMessage id="groups.toggleGroupTimes" />
                </Button>
                {removeGroupButton(tableIndex)}
              </div>
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
                  {grop.students.map((student, rowIndex) => (
                    <DraggableRow
                      key={student.id}
                      action={swapElements}
                      index={rowIndex}
                      tableIndex={tableIndex}
                    >
                      <Popup 
                        content={() => popupTimesDisplay(student)} 
                        trigger={
                        <Table.Cell>{`${student.firstname} ${student.lastname}`}</Table.Cell>
                        }
                        disabled={ groupTimesVisible || !course.questions.some(q => q.questionType === 'times') }
                      />
                      <Table.Cell>
                        {privacyToggle ? dummyStudentNumber : student.studentNo}
                      </Table.Cell>
                      <Table.Cell>{privacyToggle ? dummyEmail : student.email}</Table.Cell>
                      {regByStudentId[student.studentNo]?.questionAnswers.map(qa =>
                        questionSwitch(qa)
                      )}
                    </DraggableRow>
                  ))}
                </Table.Body>
              </Table>

              {showGroupTimes[tableIndex] ? (
                <List horizontal verticalAlign="top">
                  <List.Item>
                    <HourDisplay
                      header={'Combined'}
                      groupId={grop.id}
                      students={grop.students.length}
                      times={count(grop.students.map(student => regByStudentId[student.studentNo]))}
                    />
                  </List.Item>
                  {grop.students.map((student, rowIndex) => {
                    regByStudentId[student.studentNo].questionAnswers.map(qa => questionSwitch(qa));
                    return (
                      <List.Item>
                        <HourDisplay
                          groupId={student.id}
                          header={`${student.firstname} ${student.lastname}`}
                          students={1}
                          times={count([regByStudentId[student.studentNo]])}
                        />
                      </List.Item>
                    );
                  })}
                </List>
              ) : null}
            </div>
          )
          })}
        </div>
      )}
      <div>{addGroupButton()}</div>
    </div>
  );
};
