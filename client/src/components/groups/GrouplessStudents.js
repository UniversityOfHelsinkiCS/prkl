import React, { useState, useEffect } from 'react';
import { Table, Segment, Label, Popup, Form, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FIND_GROUP_FOR_ONE_STUDENT } from '../../GqlQueries';
import { useMutation } from '@apollo/react-hooks';
import { useStore } from 'react-hookstore';

export default ({ grouplessStudents, course, setGrouplessStudents, setRegistrationsWithoutGroups }) => {

  const [findGroupForOne] = useMutation(FIND_GROUP_FOR_ONE_STUDENT);
  const [groups, setGroups] = useStore('groupsStore');

  const intl = useIntl();

  const findGroup = async ( student ) => {
    console.log(student);
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
      console.log(newGroupless)

      newGroupless.length > 0 ?
        setRegistrationsWithoutGroups(true) :
        setRegistrationsWithoutGroups(false);
        
      setGrouplessStudents(newGroupless);

    } catch (e) {
      console.log(e);
    }

//    setGroups(res);
  };

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

                  <Popup
                    content={intl.formatMessage({ id: 'groups.findGroupForOne' })}
                    trigger={
                      <Button
                        content='Find Group'
                        color="green"
                        onClick={() => findGroup(student)}
                      />
                    }
                  />

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

                  </Table.Cell>

                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
      <br />
    </div>
  );
};