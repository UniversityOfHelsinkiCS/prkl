import React from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Registration from '../registration/Registration';
import CourseRegistration from '../../admin/CourseRegistrations';
import roles from '../../util/user_roles';

export default ({ userIsRegistered, course, registrations, user }) => {
  const paragraphs = course.description ? course.description.split('\n\n') : [];

  return (
    <div>
      <p />
      {userIsRegistered() ? (
        <Header as="h2">
          <Icon name="thumbs up outline" />
          <Header.Content>
            <FormattedMessage id="course.userHasRegistered" />
          </Header.Content>
        </Header>
      ) : (
        <>
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
          <Registration courseId={course.id} questions={course.questions} />
        </>
      )}
      <div>
        {course.questions && registrations && user.role === roles.ADMIN_ROLE ? (
          <div>
            <CourseRegistration course={course} registrations={registrations} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
