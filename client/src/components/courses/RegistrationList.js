
import React from 'react';
import { useStore } from 'react-hookstore';
import { Header, Icon, Button } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import Registration from '../registration/Registration';
import CourseRegistration from '../../admin/CourseRegistrations';
import roles from '../../util/user_roles';
import { DELETE_REGISTRATION } from '../../GqlQueries';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';

export default ({ userIsRegistered, course, registrations, setRegistrations }) => {
  const paragraphs = course.description ? course.description.split('\n\n') : [];
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);
  const [user, setUser] = useStore('userStore');
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
        const updatedUser = user;
        const regs = updatedUser.registrations.filter(r => r.course.id !== courseId);
        updatedUser.registrations = regs;
        setUser(updatedUser);
      } catch (deletionError) {
        console.log('error:', deletionError);
      }
      history.push('/courses');
    }
  }

  return (
    <div>
      <p />
      <div>
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
            <Registration course={course} courseId={course.id} questions={course.questions} />
          </div>
            ) : null}
            </div>
      )}
      </div>
      <div>
        {course.questions && registrations && (user.role === roles.ADMIN_ROLE || (user.role === roles.STAFF_ROLE && user.id === course.teacher.id)) ? (
          <div>
            <CourseRegistration course={course} registrations={registrations} setRegistrations={setRegistrations} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
