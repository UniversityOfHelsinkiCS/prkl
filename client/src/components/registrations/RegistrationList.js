import React, { useContext } from 'react';
import CourseRegistrations from './CourseRegistrations';
import roles from '../../util/userRoles';
import { AppContext } from '../../App';

export default ({ courseReducer, course, regByStudentId }) => {

  const [{ registrations }] = courseReducer;

  const { user } = useContext(AppContext);

  // eslint-disable-next-line no-console
  console.log(courseReducer);

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
