import React, { useState, useEffect } from 'react';
import { Table, Segment, Label, Popup, Form, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FIND_GROUP_FOR_ONE_STUDENT, FIND_GROUP_FOR_MULTIPLE_STUDENTS } from '../../GqlQueries';
import { useMutation } from '@apollo/react-hooks';
import { useStore } from 'react-hookstore';
import _ from 'lodash';

export default ({ grouplessStudents, course, setGrouplessStudents, setRegistrationsWithoutGroups }) => {

  const [findGroupForMultipleStudents] = useMutation(FIND_GROUP_FOR_MULTIPLE_STUDENTS);
  const [findGroupForOne] = useMutation(FIND_GROUP_FOR_ONE_STUDENT);
  const [groups, setGroups] = useStore('groupsStore');
  const [maxGroupSize, setMaxGroupSize] = useState(5);

  const intl = useIntl();

  const findGroup = async ( student ) => {
    const groupsWithUserIds = groups.map(group => {
      const userIds = group.students.map(student => student.id);
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
      maxGroupSize: maxGroupSize
    };
    try {
      const res = await findGroupForOne({
        variables,
      });

      const mappedGroups = res.data.findGroupForOne.map((e,i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i+1}`
        }
      });
      setGroups(mappedGroups);
      const newGroupless = grouplessStudents.filter(groupless => groupless !== student)

      newGroupless.length > 0 ?
        setRegistrationsWithoutGroups(true) :
        setRegistrationsWithoutGroups(false);
        
      setGrouplessStudents(newGroupless);

    } catch (e) {
      console.log(e);
    }
  };

  const handleSwitchingGroup = ( student, toGroup ) => {
    const newGroups = groups[toGroup];
    newGroups.students.push(student);
    setGroups(groups);

    const newGroupless = grouplessStudents.filter(groupless => groupless !== student)

      newGroupless.length > 0 ?
        setRegistrationsWithoutGroups(true) :
        setRegistrationsWithoutGroups(false);
        
      setGrouplessStudents(newGroupless);
  }

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

    const grouplessStudentsWithUserIds = grouplessStudents.map(student => {
      return {
        userIds: grouplessUserId,
        id: 'groupless',
        groupName: 'groupless',
        groupMessage: 'groupless'
      }
    })

    const variables = {
      data: { courseId: course.id, groups: groupsWithUserIds },
      maxGroupSize: maxGroupSize,
      groupless: { courseId: course.id, groups: grouplessStudentsWithUserIds }
    };

    try {
      const res = await findGroupForMultipleStudents({
        variables,
      });

      const mappedGroups = res.data.findGroupForMultipleStudents.map((e,i) => {
        return {
          groupId: '',
          students: e.students,
          groupMessage: '',
          groupName: `${intl.formatMessage({ id: 'groupsView.defaultGroupNamePrefix' })} ${i+1}`
        }
      });
      setGroups(mappedGroups);
      

    } catch (e) {

    }
  }
  

  return (
    <div>
      <Segment data-cy="groupless-container">
        <Label
          color="red"
          size="large"
          attached="top"
          data-cy="group-name-label"
        >
          {'Groupless students'}
        </Label>

        <Table singleLine fixed>
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
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {grouplessStudents.map(student => {
              return (
                <Table.Row>
                  <Table.Cell>
                    {`${student.firstname} ${student.lastname}`}
                  </Table.Cell>

                  <Table.Cell>
                    {student.studentNo}
                  </Table.Cell>

                  <Table.Cell>
                    {student.email}
                  </Table.Cell>

                  <Table.Cell>
                    <Form.Input
                      required
                      value={maxGroupSize}
                      type="number"
                      min="1"
                      max="9999999"
                      onChange={event => setMaxGroupSize(Number.parseInt(event.target.value, 10)
                        ? Number.parseInt(event.target.value, 10)
                        : '')}
                    />
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Popup
                        content={intl.formatMessage({ id: 'groups.findGroupForOne' })}
                        trigger={
                          <Button
                            content='Find Group'
                            color="green"
                            data-cy="find-group-button"
                            onClick={() => findGroup(student)}
                          />
                        }
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <Popup
                      data-cy="student-options-popup"
                      content={
                        <Form>
                          <Form.Field>
                            <Form.Select
                              data-cy="switch-group-select"
                              label={intl.formatMessage({ id: 'groups.switchGroupLabel' })}
                              options={switchGroupOptions}
                              onChange={(e, { value }) =>
                              handleSwitchingGroup(student, value)
                              }
                            />
                          </Form.Field>
                        </Form>
                      }
                    on="click"
                    trigger={
                      <Button data-cy="switch-group-button">
                        <FormattedMessage id="groups.switchGroupButton" />
                      </Button>
                    }
                    />
                  </Table.Cell>
                    
                  
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
        content={'Find Group For All Groupless Students'}
        onClick={() => findGroupForall()}
        /> 
      </Segment>
      <br />
    </div>
  );
};