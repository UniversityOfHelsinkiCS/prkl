import React from 'react';
import { useStore } from 'react-hookstore';
import CourseRegistrations from './CourseRegistrations';
import roles from '../../util/userRoles';

export default ({ course, registrations, setRegistrations, regByStudentId }) => {
  const [user] = useStore('userStore');

  const hasAccess = () => {
    if (user.role === roles.ADMIN_ROLE) {
      return true;
    }
    return (
      user.role === roles.STAFF_ROLE && course.teachers.find(t => t.id === user.id) !== undefined
    );
  };

  return (
    <div>
      <p />
      <div>
        {course.questions && registrations && hasAccess ? (
          <div>
            <CourseRegistrations
              course={course}
              registrations={registrations}
              setRegistrations={setRegistrations}
              regByStudentId={regByStudentId}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
