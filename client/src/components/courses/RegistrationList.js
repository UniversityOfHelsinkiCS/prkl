import React from 'react';
import { Header } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import CourseRegistration from '../../admin/CourseRegistrations';
import roles from '../../util/user_roles';

export default ({ course, registrations, user }) => {
  const paragraphs = course.description ? course.description.split('\n\n') : [];
  
  return (
    <div>
      <p />
      <div>
      {new Date(course.deadline) > new Date() ? (
        <div>
        <Header as="h4" color="red">
          <FormattedMessage id="course.deadline" />
          &nbsp;
          <FormattedDate value={course.deadline} />
        </Header>
        <div>
          {paragraphs.map(p => (
            <p>{p}</p>
          ))}
          </div>
        </div>
          ) : null}
      </div>
      <div>
        {course.questions && registrations && (user.role === roles.ADMIN_ROLE || (user.role === roles.STAFF_ROLE && user.id === course.teacher.id)) ? (
          <div>
            <CourseRegistration course={course} registrations={registrations} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
