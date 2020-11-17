
import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import roles from '../../util/userRoles';
import { Dropdown } from 'semantic-ui-react';
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

  // this will be current user when creating a new course
  const preSelected = courseTeachers.map(u => u = u.id);

  const optionTeachers = teachers.map(u =>({
    value: u.id,
    text: `${u.firstname} ${u.lastname}`
  }));

  const handleTeacherToggle = (e, data) => {
    // data.value is an array of id's
    const newTeachers = teachers.filter(t => {
      return data.value.includes(t.id)
    });
    setCourseTeachers(newTeachers);
  }

  return (
    <div>
        <Dropdown
          placeholder='Teachers'
          fluid
          multiple
          search
          selection
          defaultValue={preSelected}
          options={optionTeachers}
          onChange={handleTeacherToggle}
          data-cy="teacher-dropdown"
        />
    </div>
  );
}
