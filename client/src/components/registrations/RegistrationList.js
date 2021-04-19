import React, { useContext } from 'react';
import CourseRegistrations from './CourseRegistrations';
import roles from '../../util/userRoles';
import { AppContext } from '../../App';

export default ({ registrations, course, regByStudentId }) => {
  const { user } = useContext(AppContext);

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
              regByStudentId={regByStudentId}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
