import React, { useState, useEffect } from 'react';
import { Table, Segment, Label, Popup, Form, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

export default ({ grouplessStudents }) => {
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