import React, { useState } from 'react';
import { Checkbox, Table } from 'semantic-ui-react';

export default ({ teachers }) => {
    const [courseTeachers, setCourseTeachers] = useState([]);

    console.log('Teachers in db: ', teachers);

    const createCheckbox = ( onChange ) => {
      return (
        <Checkbox
          style={{ marginRight: '1rem' }}
          toggle
          onChange={onChange}
        />
      )
    }

    const handleTeacherToggle = teacherId => {
      // if (courseTeachers.includes(teacherId)) {
      //   const newTeachers = courseTeachers.filter(t => t !== teacherId);
      //   setCourseTeachers(newTeachers);
      // } else {
      //   const newTeachers = courseTeachers.concat(teacherId);
      //   setCourseTeachers(newTeachers);
      // }
      console.log('Teachers: ', courseTeachers);
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
                {createCheckbox(handleTeacherToggle(u.id))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>   
      </div>
    );
}