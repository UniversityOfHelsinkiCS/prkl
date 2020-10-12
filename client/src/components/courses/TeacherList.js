import React, { useState } from 'react';
import { Checkbox, Table } from 'semantic-ui-react';

export default ({ teachers, courseTeachers, setCourseTeachers }) => {
  const createCheckbox = (onChange) => {
    return (
      <Checkbox
        style={{ marginRight: '1rem' }}
        toggle
        onChange={onChange}
      />
    )
  }

  const handleTeacherToggle = teacher => {
    if (courseTeachers.includes(teacher)) {
      const newTeachers = courseTeachers.filter(t => t.id !== teacher.id);
      setCourseTeachers(newTeachers);
    } else {
      const newTeachers = courseTeachers.concat(teacher);
      setCourseTeachers(newTeachers);
    }
  }

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
              {createCheckbox(() => handleTeacherToggle(u))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}