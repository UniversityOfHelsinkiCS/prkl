/* eslint-disable react/jsx-wrap-multilines */
import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { Table, Header, List, Button, Segment, Popup, Input, Label, Form, Icon } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import DraggableRow from './DraggableRow';
import questionSwitch, { count } from '../../util/functions';
import HourDisplay from '../misc/HourDisplay';

export default ({
  course,
  regByStudentId,
  groupNames,
  setGroupNames,
  groupMessages,
  setGroupMessages,
  setRegistrationsWithoutGroups,
  grouplessStudents,
  setGrouplessStudents,
}) => {
  const [privacyToggle] = useStore('toggleStore');
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  const [groups, setGroups] = useStore('groupsStore');

  const [showGroupTimes, setShowGroupTimes] = useState([]);
  const [groupTimesVisible, setGroupTimesVisible] = useState([]);

  const intl = useIntl();

  useEffect(() => {
    if (groups.length > 0) {
      setShowGroupTimes(Array(groups.length).fill(false));
      setGroupTimesVisible(Array(groups.length).fill(false));
    }
  }, [groups]);

  const setUnsaved = () => {
    if (!groupsUnsaved) {
      setGroupsUnsaved(true);
    }
  };

  const handleGroupNameChange = (e, index) => {
    const newGroupNames = [...groupNames];
    newGroupNames[index] = e.target.value;
    setGroupNames(newGroupNames);
    setUnsaved();
  };

  const handleGroupMessageChange = (e, index) => {
    const newGroupMsgs = [...groupMessages];
    newGroupMsgs[index] = e.target.value;
    setGroupMessages(newGroupMsgs);
    setUnsaved();
  };

  const addGroup = () => {
    const newGroups = _.cloneDeep(groups);
    const newGroupName = `${intl.formatMessage({
      id: 'groupsView.defaultGroupNamePrefix',
    })} ${groups.length + 1}`;
    newGroups.push({
      groupId: '',
      students: [],
      groupMessage: '',
      groupName: newGroupName,
    });
    setGroups(newGroups);

    const newGroupMsgs = [...groupMessages];
    newGroupMsgs.push('');
    setGroupMessages(newGroupMsgs);

    const newGroupNames = [...groupNames];
    newGroupNames.push(newGroupName);
    setGroupNames(newGroupNames);

    setShowGroupTimes(showGroupTimes.push(false));

    setGroupsUnsaved(true);
  };

  const removeGroup = index => {
    const newGroups = _.cloneDeep(groups);
    newGroups.splice(index, 1);
    setGroups(newGroups);

    const newGroupNames = [...groupNames];
    newGroupNames.splice(index, 1);
    setGroupNames(newGroupNames);

    const newGroupMsgs = [...groupMessages];
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
        <Button
          data-cy="group-remove-button"
          size="mini"
          color="red"
          onClick={() => removeGroup(index)}
        >
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
    if (fromTable === toTable) {
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

  const removeStudentFromGroup = (fromTable, fromIndex) => {
    const newGroups = _.cloneDeep(groups);
    const removed = newGroups[fromTable].students.splice(fromIndex, 1);

    setGroups(newGroups);
    setGrouplessStudents([...grouplessStudents, removed[0]]);
    setGroupsUnsaved(true);
    setRegistrationsWithoutGroups(true);
  };

  const handleShowGroupTimesClick = index => {
    const newGroupTimesVisible = [...groupTimesVisible];
    newGroupTimesVisible[index] = !groupTimesVisible[index];
    setGroupTimesVisible(newGroupTimesVisible);
    const newShowTimes = [...showGroupTimes];
    newShowTimes[index] = !newShowTimes[index];
    setShowGroupTimes(newShowTimes);
  };

  const popupTimesDisplay = student => (
    <HourDisplay
      groupId={student.id}
      header={`${student.firstname} ${student.lastname}`}
      students={1}
      times={count([regByStudentId[student.studentNo]])}
    />
  );

  const handleSwitchingGroup = (fromTableIndex, fromRowIndex, toTableIndex) => {
    const toRowIndex = groups[toTableIndex].students.length;
    swapElements(fromRowIndex, toRowIndex, fromTableIndex, toTableIndex);
  };

  const switchGroupOptions = groups.map((group, tableIndex) => ({
    key: tableIndex,
    text:
      group.groupName ||
      `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${tableIndex + 1}`,
    value: tableIndex,
  }));

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
          {groups.map((group, tableIndex) => {
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
                        as="a"
                        color="grey"
                        size="large"
                        attached="top"
                        data-cy="group-name-label"
                      >
                        {groupNames[tableIndex] || ''}
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
                  <Header style={{ marginBottom: 5 }} as="h5">
                    <FormattedMessage id="groups.message" />
                  </Header>
                  <Input
                    data-cy="group-message-input"
                    fluid
                    placeholder={intl.formatMessage({ id: 'groups.messageInfo' })}
                    value={groupMessages[tableIndex] || ''}
                    onChange={e => handleGroupMessageChange(e, tableIndex)}
                  />
                </Segment>
                <Segment>
                  <Header as="h5">
                    <FormattedMessage id="groups.students" />
                  </Header>
                  <Table 
                    data-cy="generated-groups"
                  >
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
                            <Table.HeaderCell key={question.id}>
                              {question.content}
                            </Table.HeaderCell>
                          ) : null
                        )}

                        <Table.HeaderCell />
                        <Table.HeaderCell />

                      </DraggableRow>
                    </Table.Header>

                    <Table.Body>
                      {group.students.map((student, rowIndex) => (
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
                            disabled={
                              groupTimesVisible[tableIndex] ||
                              !course.questions.some(q => q.questionType === 'times')
                            }
                          />

                          <Table.Cell>
                            {privacyToggle ? dummyStudentNumber : student.studentNo}
                          </Table.Cell>

                          <Table.Cell>{privacyToggle ? dummyEmail : student.email}</Table.Cell>
                          {regByStudentId[student.studentNo]?.questionAnswers.map(qa =>
                            questionSwitch(qa)
                          )}

                          <Table.Cell singleLine>
                            <Popup
                              data-cy="student-options-popup"
                              content={
                                <Form>
                                  <Form.Field>
                                    <Form.Select
                                      data-cy="switch-group-select"
                                      label={intl.formatMessage({ id: 'groups.switchGroupLabel' })}
                                      options={switchGroupOptions}
                                      defaultValue={switchGroupOptions[tableIndex].value}
                                      onChange={(e, { value }) =>
                                        handleSwitchingGroup(tableIndex, rowIndex, value)
                                      }
                                    />
                                  </Form.Field>
                                </Form>
                              }
                              on="click"
                              trigger={
                                <Button 
                                  data-cy="switch-group-button"
                                  icon="exchange"
                                />                              
                              }
                            />

                            <Popup
                              content={intl.formatMessage({ id: 'groups.removeFromGroupLabel' })}
                              trigger={
                                <Button
                                  data-cy="remove-from-group-button"
                                  icon="delete"
                                  color="red"
                                  onClick={() => removeStudentFromGroup(tableIndex, rowIndex)}
                                />
                              }
                            />
                          </Table.Cell>
                        </DraggableRow>
                      ))}
                    </Table.Body>
                  </Table>

                  <Button.Group size="mini">
                    <Button
                      size="mini"
                      onClick={() => handleShowGroupTimesClick(tableIndex)}
                      disabled={!course.questions.some(q => q.questionType === 'times')}
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
                          header="Combined"
                          groupId={group.id}
                          students={group.students.length}
                          times={count(
                            group.students.map(student => regByStudentId[student.studentNo])
                          )}
                        />
                      </List.Item>
                      {group.students.map(student => {
                        regByStudentId[student.studentNo].questionAnswers.map(qa =>
                          questionSwitch(qa)
                        );
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
            );
          })}
        </div>
      )}
      <div>{addGroupButton()}</div>
    </div>
  );
};
