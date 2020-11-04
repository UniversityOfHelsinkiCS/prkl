
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import roles from '../../util/userRoles';
import { Dropdown, Form } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { FACULTY_USERS } from '../../GqlQueries';

export default ({ courseTeachers, setCourseTeachers }) => {
  const [teachers, setTeachers] = useStore('teacherStore');
  const [user] = useStore('userStore');
  

  const { loading:facultyLoading, error:facultyError, data:facultyData } = useQuery(
    FACULTY_USERS,
    {
      skip: user.role === roles.STUDENT_ROLE,
    }
  );

  useEffect(() => {
    if (!facultyLoading && facultyData?.facultyUsers !== undefined) {
      const teachers = facultyData?.facultyUsers;
      setTeachers(teachers);      
    }  
  }, [
    facultyData,
    facultyError,
    facultyLoading,
  ])

  const optionTeachers = teachers.map(u =>({
    key:u.id,
    value:u,
    text: u.firstname
  }));


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