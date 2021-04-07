import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Dropdown, Loader } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { useIntl } from 'react-intl';

import roles from '../../util/userRoles';
import { FACULTY_USERS } from '../../GqlQueries';
import { AppContext } from '../../App';

export default ({ courseTeachers, setCourseTeachers }) => {
  const [teachers, setTeachers] = useStore('teacherStore');
  const { user } = useContext(AppContext);

  const intl = useIntl();

  const { loading: facultyLoading, error: facultyError, data: facultyData } = useQuery(
    FACULTY_USERS,
    {
      skip: user.role === roles.STUDENT_ROLE,
    }
  );

  useEffect(() => {
    if (!facultyLoading && facultyData?.facultyUsers !== undefined) {
      const newTeachers = facultyData?.facultyUsers;
      setTeachers(newTeachers);
    }
  }, [facultyData, facultyError, facultyLoading]); // eslint-disable-line

  // this will be current user when creating a new course
  const preSelected = courseTeachers.map(u => u.id);

  const optionTeachers = teachers.map(u => ({
    value: u.id,
    text: `${u.firstname} ${u.lastname}`,
  }));

  const handleTeacherToggle = (e, data) => {
    // data.value is an array of id's
    const newTeachers = teachers.filter(t => {
      return data.value.includes(t.id);
    });
    setCourseTeachers(newTeachers);
  };

  return (
    <div>
      <Dropdown
        placeholder={intl.formatMessage({ id: 'courseForm.teachers' })}
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
};
