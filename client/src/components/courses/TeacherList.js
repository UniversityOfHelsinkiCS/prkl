import React, { useContext, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { useQuery } from '@apollo/client';
import { useIntl } from 'react-intl';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { FACULTY_USERS } from '../../GqlQueries';
import roles from '../../util/userRoles';
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

  const handleTeacherToggle = (e, data) => {
    const newTeachers = teachers.filter(t => {
      return data.find(value => value.id === t.id);
    });
    setCourseTeachers(newTeachers);
  };

  return (
    <div>
      <Autocomplete
        multiple
        options={teachers}
        getOptionLabel={option => `${option.firstname} ${option.lastname}`}
        getOptionSelected={(option, value) => option.id === value.id}
        value={courseTeachers}
        onChange={handleTeacherToggle}
        renderInput={params => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            label={intl.formatMessage({ id: 'courseForm.teachers' })}
          />
        )}
        disableCloseOnSelect
        data-cy="teacher-dropdown"
      />
    </div>
  );
};
