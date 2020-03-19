import React from 'react';
import { Table, Header } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const Groups = () => {
  // Mock data
  const groups = [
    [
      { firstname: 'Bruce', lastname: 'Wayne', studentno: '0123', email: 'batmail' },
      { firstname: 'Clark', lastname: 'Kent', studentno: '0987', email: 'supermail' },
    ],
    [
      { firstname: 'Peter', lastname: 'Parker', studentno: '0456', email: 'spidermail' },
      { firstname: 'Tony', lastname: 'Stark', studentno: '1337', email: 'ironmail' },
    ],
  ];

  return (
    <div>
      {groups.map((grop, index) => (
        <div key={index}>
          <p />
          <Header as="h3">
            <div>
              <FormattedMessage id="group.title" /> {index + 1}:
            </div>
          </Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <FormattedMessage id="group.name" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="group.studentNumber" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="group.email" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {grop.map(student => (
                <Table.Row key={student.studentno}>
                  <Table.Cell>
                    {student.firstname} {student.lastname}
                  </Table.Cell>
                  <Table.Cell>{student.studentno}</Table.Cell>
                  <Table.Cell>{student.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default Groups;
