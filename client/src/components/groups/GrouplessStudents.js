/* eslint-disable react/jsx-wrap-multilines */
import React, { useState } from 'react';
import { Table, Segment, Label, Popup, Form, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useStore } from 'react-hookstore';
import _ from 'lodash';
import { FIND_GROUP_FOR_ONE_STUDENT, FIND_GROUP_FOR_MULTIPLE_STUDENTS } from '../../GqlQueries';

export default ({
  grouplessStudents,
  course,
  setGrouplessStudents,
  setRegistrationsWithoutGroups,
}) => {
  const [findGroupForMultipleStudents] = useMutation(FIND_GROUP_FOR_MULTIPLE_STUDENTS);
  const [findGroupForOne] = useMutation(FIND_GROUP_FOR_ONE_STUDENT);
  const [groups, setGroups] = useStore('groupsStore');
  const [maxGroupSize, setMaxGroupSize] = useState(course.maxGroupSize);
  const [errorMessage, setErrorMessage] = useState('');

  const intl = useIntl();

  const findGroup = async student => {
    console.log(groups);
    const groupsWithUserIds = groups.map(group => {
      const userIds = group.students.map(s => s.id);
      return {
        userIds,
        id: group.groupId,
        groupName: group.groupName,
        groupMessage: group.groupMessage,
      };
    });
    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      studentId: student.id,
      maxGroupSize,
    };
    try {
      const res = await findGroupForOne({
        variables,
      });

      const mappedGroups = res.data.findGroupForOne.map((e, i) => {
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
        alert(intl.formatMessage({ id: 'groupsView.noGroupFoundAlert' }));
        return;
      }

      setGroups(mappedGroups);

      if (newGroupless.length > 0) {
        setRegistrationsWithoutGroups(true);
      } else {
        setRegistrationsWithoutGroups(false);
      }
      setGrouplessStudents(newGroupless);
    } catch (e) {
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

    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      maxGroupSize,
      groupless: { courseId: course.id, groups: grouplessStudentsWithUserIds }
    };

    try {
      const res = await findGroupForMultipleStudents({
        variables,
      });

      const mappedGroups = res.data.findGroupForMultipleStudents.map((e, i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i + 1}`,
        };
      });

      setGroups(mappedGroups);

      const studentIds = [];

      mappedGroups.map(g => {
        g.students.map(({ id }) => {
          if (id)
            studentIds.push(id)});
      });

      const grouplessStudentIds = [];

      grouplessStudents.map(({ id }) => {
        if (id)
          grouplessStudentIds.push(id)
      })

      let groupless = false;

      grouplessStudentIds.map(id => {
        if (!studentIds.includes(id)) {
          groupless = true;
        }
      });

      if (groupless) {
        alert(intl.formatMessage({ id: 'groupsView.grouplessStudentAlert' }));
      }
    } catch (e) {
      console.log(e);
    }
  };

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
                <FormattedMessage id="groups.maxSize" />
                &nbsp;
                <Popup
                  content={intl.formatMessage({ id: 'groups.maxSizeInfo' })}
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
                  <Table.Cell>{`${student.firstname} ${student.lastname}`}</Table.Cell>

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

                  {/*<Popup
                    data-cy="student-options-popup"
                    content={
                      <Form>
                        <Form.Field>
                          <Form.Select
                            data-cy="switch-group-select"
                            label={'Add student to a group'}
                            //options={switchGroupOptions}
                            defaultValue={"eka group tähän"}
                            //onChange={(e, { value }) =>
                              //handleSwitchingGroup(tableIndex, rowIndex, value)
                            //}
                          />
                        </Form.Field>
                      </Form>
                    }
                    on="click"
                    trigger={
                        <Button data-cy="switch-group-button">
                          {'Add student to a group'}
                        </Button>
                    }/>*/}

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
