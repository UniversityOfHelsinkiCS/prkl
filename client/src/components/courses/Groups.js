import React from 'react';
import { Table, Header } from 'semantic-ui-react';

const Groups = () => {
  // Mock data
  const groups = [
    [
      { firstname: 'Batman', lastname: 'Batname', studentno: '0123', email: 'batmail' },
      { firstname: 'Superman', lastname: 'Supername', studentno: '0987', email: 'supermail' },
    ],
    [
      { firstname: 'Spiderman', lastname: 'Spidername', studentno: '0456', email: 'spidermail' },
      { firstname: 'Daredevil', lastname: 'Devilname', studentno: '0666', email: 'devilmail' },
    ],
  ];

  return (
    <div>
      <h2>Groups:</h2>
      {groups.map((grop, index) => (
        <div key={index}>
          <p />
          <Header as="h3">
            <div>
              Group {index + 1}:
            </div>
          </Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Student no.</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
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
