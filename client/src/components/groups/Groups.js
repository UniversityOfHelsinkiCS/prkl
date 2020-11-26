import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { Table, Header, List, Button, Segment, Grid, Popup, Input, Label, TextArea, Form } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import DraggableRow from './DraggableRow';
import questionSwitch, { count } from '../../util/functions';
import HourDisplay from '../misc/HourDisplay';
import _ from 'lodash';

export default ({ course, regByStudentId, groupNames, setGroupNames, groupMessages, setGroupMessages }) => {
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

  const handleGroupNameChange = (e, index) => {
    const newGroupNames = [ ...groupNames ];
    newGroupNames[index] = e.target.value;
    setGroupNames(newGroupNames);
    setUnsaved();
  };

  const handleGroupMessageChange = (e, index) => {
    const newGroupMsgs = [ ...groupMessages ];
    newGroupMsgs[index] = e.target.value;
    setGroupMessages(newGroupMsgs);
    setUnsaved();
  };

  const addGroup = () => {
    const newGroups = _.cloneDeep(groups);
    newGroups.push({
      groupId: '',
      students: [],
      groupMessage: '',
      groupName: ''
    });
    setGroups(newGroups);

    const newGroupMsgs = [ ...groupMessages ];
    newGroupMsgs.push('');
    setGroupMessages(newGroupMsgs);
    
    const newGroupNames = [ ...groupNames ];
    newGroupNames.push('');
    setGroupNames(newGroupNames);

    setShowGroupTimes(showGroupTimes.push(false));

    setGroupsUnsaved(true);
  };

  const removeGroup = index => {
    const newGroups = _.cloneDeep(groups);
    newGroups.splice(index, 1);
    setGroups(newGroups);

    const newGroupNames = [ ...groupNames ];
    newGroupNames.splice(index, 1);
    setGroupNames(newGroupNames);

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
        <Button size="mini" color="red" onClick={() => removeGroup(index)}>
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
    if (fromTable == toTable) {
      return;
    }
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
            <Segment.Group data-cy="group-container" key={`Group-${tableIndex}`}>
              <Segment>
                <Popup 
                  data-cy="group-name-popup"
                  content={
                  <input 
                    data-cy="group-name-input"
                    value={groupNames[tableIndex] || ''}
                    onChange={e => handleGroupNameChange(e, tableIndex)}
                  />
                  }
                  on="click"
                  trigger={
                    <Label
                      color="grey"
                      size="large"
                      attached="top"
                    >
                      { groupNames[tableIndex] || '' }
                    </Label>
                  }
                />
                {/*<Label
                  color="grey"
                  size="large"
                  attached="top"
                >

                  <FormattedMessage id="groups.title" /> 
                  {tableIndex + 1}
                </Label>*/}
                <Header style={{marginBottom: 5}} as="h5">Message for the group:</Header>
                <Input
                  data-cy="group-message-input"
                  fluid
                  placeholder="Use this to send a message to members of this group..."
                  value={groupMessages[tableIndex] || ''}
                  onChange={e => handleGroupMessageChange(e, tableIndex)}
                />
              </Segment>
              <Segment>
                <Header as="h5">Students in this group:</Header>
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

                <Button.Group size="mini">
                  <Button
                    size="mini"
                    onClick={() => handleShowGroupTimesClick(tableIndex)}
                    disabled={ !course.questions.some(q => q.questionType === 'times') }
                  >
                    <FormattedMessage id="groups.toggleGroupTimes" />
                  </Button>
                  {removeGroupButton(tableIndex)}
                </Button.Group>
              </Segment>

              {showGroupTimes[tableIndex] ? (
                <Segment>
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
                </Segment>
              ) : null}
            </Segment.Group>
          )
          })}
        </div>
      )}
      <div>{addGroupButton()}</div>
    </div>
  );
};
