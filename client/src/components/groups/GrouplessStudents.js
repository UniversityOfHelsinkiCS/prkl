/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { useStore } from 'react-hookstore';
import { useMutation } from '@apollo/react-hooks';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Segment, Label, Popup, Form, Button } from 'semantic-ui-react';

import { FIND_GROUP_FOR_GROUPLESS_STUDENTS } from '../../GqlQueries';

import HourDisplay from '../misc/HourDisplay';
import { count } from '../../util/functions';

export default ({
  grouplessStudents,
  course,
  setGrouplessStudents,
  setRegistrationsWithoutGroups,
  regByStudentId,
}) => {
  const [findGroupForGrouplessStudents] = useMutation(FIND_GROUP_FOR_GROUPLESS_STUDENTS);
  const [groups, setGroups] = useStore('groupsStore');
  const [notification, setNotification] = useStore('notificationStore');
  const [maxGroupSize, setMaxGroupSize] = useState(course.maxGroupSize);
  const [groupsUnsaved, setGroupsUnsaved] = useStore('groupsUnsavedStore');
  
  const intl = useIntl();

  const findGroup = async student => {
    const groupsWithUserIds = groups.map(group => {
      const userIds = group.students.map(s => s.id);
      return {
        userIds,
        id: group.groupId,
        groupName: group.groupName,
        groupMessage: group.groupMessage,
      };
    });
    const grouplessStudent = {
      userIds: [student.id],
      id: 'groupless',
      groupName: 'groupless',
      groupMessage: 'groupless',
    };
    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      maxGroupSize,
      groupless: { courseId: course.id, groups: grouplessStudent },
    };
    try {
      const res = await findGroupForGrouplessStudents({
        variables,
      });

      const mappedGroups = res.data.findGroupForGrouplessStudents.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });

      const newGroupless = grouplessStudents.filter(groupless => groupless !== student);

      const groupFound = mappedGroups.some(group => group.students.find(s => s.id === student.id));

      if (!groupFound) {
        setNotification({
          type: 'error',
          message: intl.formatMessage({ id: 'groupsView.noGroupFoundAlert' }),
          visible: true,
        });
        return;
      }

      setGroups(mappedGroups);
      setGroupsUnsaved(true);
      if (newGroupless.length > 0) {
        setRegistrationsWithoutGroups(true);
      } else {
        setRegistrationsWithoutGroups(false);
      }
      setGrouplessStudents(newGroupless);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const handleSwitchingGroup = (student, toGroup) => {
    const newGroups = groups[toGroup];
    newGroups.students.push(student);
    setGroups(groups);

    const newGroupless = grouplessStudents.filter(groupless => groupless !== student);

    if (newGroupless.length > 0) {
      setRegistrationsWithoutGroups(true);
    } else {
      setRegistrationsWithoutGroups(false);
    }
    setGrouplessStudents(newGroupless);
  };

  const switchGroupOptions = groups.map((group, tableIndex) => ({
    key: tableIndex,
    text:
      group.groupName ||
      `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${tableIndex + 1}`,
    value: tableIndex,
  }));

  const findGroupForall = async () => {
    const groupsWithUserIds = groups.map(group => {
      const userIds = group.students.map(student => student.id);
      return {
        userIds,
        id: group.groupId,
        groupName: group.groupName,
        groupMessage: group.groupMessage,
      };
    });

    const grouplessUserId = grouplessStudents.map(student => student.id);

    const grouplessStudentsWithUserIds = grouplessStudents.map(() => {
      return {
        userIds: grouplessUserId,
        id: 'groupless',
        groupName: 'groupless',
        groupMessage: 'groupless',
      };
    });

    let studentsInGroups = 0;

    groups.forEach(g => {
      g.students.forEach(({ id }) => {
        if (id) {
          studentsInGroups++;
        }
      });
    });

    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      maxGroupSize,
      groupless: { courseId: course.id, groups: grouplessStudentsWithUserIds },
    };

    try {
      const res = await findGroupForGrouplessStudents({
        variables,
      });

      const mappedGroups = res.data.findGroupForGrouplessStudents.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });

      setGroups(mappedGroups);

      const studentIds = [];

      mappedGroups.forEach(g => {
        g.students.forEach(({ id }) => {
          if (id) {
            studentIds.push(id);
          }
        });
      });

      console.log('id:s length', studentIds.length, ' count: ', studentsInGroups)

      const grouplessStudentIds = [];

      grouplessStudents.forEach(({ id }) => {
        if (id) {
          grouplessStudentIds.push(id);
        }
      });

      let groupless = false;

      grouplessStudentIds.forEach(id => {
        if (!studentIds.includes(id)) {
          groupless = true;
        }
      });

      if (studentIds.length !== studentsInGroups) {
        setGroupsUnsaved(true);
      }
      
      if (groupless) {
        setNotification({
          type: 'error',
          message: intl.formatMessage({ id: 'groupsView.grouplessStudentAlert' }),
          visible: true,
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const popupTimesDisplay = student => (
    <HourDisplay
      groupId={student.id}
      header={`${student.firstname} ${student.lastname}`}
      students={1}
      times={count([regByStudentId[student.studentNo]])}
    />
  );

  return (
    <div>
      <Segment data-cy="groupless-container">
        <Label color="red" size="large" attached="top" data-cy="group-name-label">
          <FormattedMessage id="groupsView.grouplessHeader" />
        </Label>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <FormattedMessage id="groups.name" />
              </Table.HeaderCell>

              <Table.HeaderCell>
                <FormattedMessage id="groups.studentNumber" />
              </Table.HeaderCell>

              <Table.HeaderCell>
                <FormattedMessage id="groups.email" />
              </Table.HeaderCell>

              <Table.HeaderCell>
                <FormattedMessage id="groups.targetGroupSize" />
                &nbsp;
                <Popup
                  content={intl.formatMessage({ id: 'groups.targetGroupSizeInfo' })}
                  trigger={<i className="question circle icon" />}
                />
                <Form.Input
                  data-cy="max-group-size"
                  required
                  value={maxGroupSize}
                  type="number"
                  min="1"
                  max="9999999"
                  onChange={event => setMaxGroupSize(Number.parseInt(event.target.value, 10) || '')}
                />
              </Table.HeaderCell>

              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {grouplessStudents.map(student => {
              return (
                <Table.Row key={student.id}>
                  <Popup
                    content={() => popupTimesDisplay(student)}
                    trigger={<Table.Cell>{`${student.firstname} ${student.lastname}`}</Table.Cell>}
                    disabled={!course.questions.some(q => q.questionType === 'times')}
                  />

                  <Table.Cell>{student.studentNo}</Table.Cell>

                  <Table.Cell>{student.email}</Table.Cell>

                  <Table.Cell>
                    <Popup
                      content={intl.formatMessage({ id: 'groups.findGroupForOne' })}
                      trigger={
                        <Button
                          content={intl.formatMessage({ id: 'groupsView.findGroup' })}
                          color="green"
                          data-cy="find-group-button"
                          onClick={() => findGroup(student)}
                        />
                      }
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <Popup
                      data-cy="switch-group-popup"
                      content={
                        <Form>
                          <Form.Field>
                            <Form.Select
                              data-cy="switch-group-select"
                              label={intl.formatMessage({ id: 'groups.moveToGroupLabel' })}
                              options={switchGroupOptions}
                              defaultValue="..."
                              onChange={(e, { value }) => handleSwitchingGroup(student, value)}
                            />
                          </Form.Field>
                        </Form>
                      }
                      on="click"
                      trigger={
                        <Button data-cy="switch-group-button">
                          <FormattedMessage id="groups.moveToGroupButton" />
                        </Button>
                      }
                    />
                  </Table.Cell>
                  <Table.Cell />
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          fluid
          data-cy="find-group-for-all-button"
          content={intl.formatMessage({ id: 'groupsView.findGroupForAll' })}
          onClick={() => findGroupForall()}
        />
      </Segment>
      <br />
    </div>
  );
};
