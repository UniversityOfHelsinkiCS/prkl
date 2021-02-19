import React, { useState, useEffect } from 'react';
import { Table, Segment, Label } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';

export default ({
    grouplessStudents
}) => {

    return (
        <div>
          <Segment>

            <Label
              color="grey"
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

                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>

          </Segment>
          <br />
        </div>
    )
}