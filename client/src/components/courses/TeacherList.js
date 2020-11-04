import React, { useState } from 'react';
import { Checkbox, Table, Dropdown, Form } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { valueFromAST } from 'graphql';

export default ({ courseTeachers, setCourseTeachers }) => {
  const [teachers, setTeachers] = useStore('teacherStore');
  const [user] = useStore('userStore');
  
  
  const optionTeachers = teachers.map(u =>({
    key:u.id,
    value:u,
    text: u.firstname
  }
  ));


  const handleTeacherToggle = (e, data) => {
    const newTeachers = data.value;

    setCourseTeachers(newTeachers);
  }


  return (

    <div>
      <Form.Field>
        <Form.Dropdown
          placeholder='Teachers'
          fluid
          multiple
          search
          selection
          options={optionTeachers}
          onChange={handleTeacherToggle}

        />
      </Form.Field>
      
    </div>

  );
}