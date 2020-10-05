import React, { useState } from 'react';
import { Checkbox, Table } from 'semantic-ui-react';

export default ({ teachers }) => {
    return (
      <div>
        <Table size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Firstname</Table.HeaderCell>
              <Table.HeaderCell>Lastname</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {teachers.map(u => (
              <Table.Row key={u.id}>
                <Table.Cell>{u.firstname}</Table.Cell>
                <Table.Cell>{u.lastname}</Table.Cell>
                <Checkbox 
                  slider
                  checked
                />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>   
      </div>
    );
}