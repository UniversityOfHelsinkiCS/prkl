
import React from 'react';
import { useStore } from 'react-hookstore';
import CourseRegistrations from './CourseRegistrations';
import roles from '../../util/userRoles';

export default ({course, registrations, setRegistrations }) => {
  const [user] = useStore('userStore');

  return (
    <div>
      <p />
      <div>
        {course.questions && registrations && (user.role === roles.ADMIN_ROLE || (user.role === roles.STAFF_ROLE && course.teachers.find(t => t.id === user.id) !== undefined)) ? (
          <div>
            <CourseRegistrations course={course} registrations={registrations} setRegistrations={setRegistrations} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
