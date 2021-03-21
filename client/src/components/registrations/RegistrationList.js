import React from 'react';
import { useStore } from 'react-hookstore';
import CourseRegistrations from './CourseRegistrations';
import roles from '../../util/userRoles';

export default ({ courseReducer, course, regByStudentId }) => {
  const [user] = useStore('userStore');

  const [{registrations}] = courseReducer

  console.log(courseReducer)

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
              courseReducer={courseReducer}
              course={course}
              regByStudentId={regByStudentId}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
