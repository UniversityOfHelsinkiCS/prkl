import React from 'react';
import { Header, Icon, Button } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Registration from '../registration/Registration';
import CourseRegistration from '../../admin/CourseRegistrations';
import roles from '../../util/user_roles';
import { DELETE_REGISTRATION } from '../../GqlQueries';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';

export default ({ userIsRegistered, course, registrations, user }) => {
  const paragraphs = course.description ? course.description.split('\n\n') : [];
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);
  const history = useHistory();
  const studentId = user.id;
  const courseId = course.id;
  const variables = { studentId, courseId };
  
  const handleRegistrationDeletion = async () => {
    if (window.confirm('Cancel registration?')) {
      try {
        await deleteRegistration({
          variables
        });
      } catch (deletionError) {
        console.log('error:', deletionError);
      }
      history.push('/courses');
    }
  }

  return (
    <div>
      <p />
      {userIsRegistered() ? (
        <Header as="h2">
          <p>
            <Icon name="thumbs up outline" />
            <Header.Content>
              <FormattedMessage id="course.userHasRegistered" />
            </Header.Content>
          </p>
          {new Date(course.deadline) > new Date() ? (
            <Button onClick={handleRegistrationDeletion} color="red" data-cy="cancel-registration-button">
              <FormattedMessage id="courseRegistration.cancel" />
            </Button>
          ) : null}
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
