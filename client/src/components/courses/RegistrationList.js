
import React from 'react';
import { useStore } from 'react-hookstore';
import { Header, Icon, Button } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate, useIntl } from 'react-intl';
import { useMutation } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import Registration from '../registration/Registration';
import CourseRegistration from '../../admin/CourseRegistrations';
import ConfirmationButton from '../misc/ConfirmationButton';
import roles from '../../util/user_roles';
import { DELETE_REGISTRATION } from '../../GqlQueries';

export default ({ userIsRegistered, course, registrations, setRegistrations }) => {
  const paragraphs = course.description ? course.description.split('\n\n') : [];
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);
  const [user, setUser] = useStore('userStore');
  const history = useHistory();
  const intl = useIntl();

  const studentId = user.id;
  const courseId = course.id;
  const variables = { studentId, courseId };

  const handleRegistrationDeletion = async () => {
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

  return (
    <div>
      <p />
      <div>
        {userIsRegistered() ? (
          <Header as="h2">
            <div>
              <Icon name="thumbs up outline" />
              <Header.Content>
                <FormattedMessage id="course.userHasRegistered" />
              </Header.Content>
            </div>
            {new Date(course.deadline) > new Date() ? (
              <ConfirmationButton
                onConfirm={handleRegistrationDeletion}
                modalMessage={intl.formatMessage({ id: "courseRegistration.cancelConfirmation" })}
                buttonDataCy="cancel-registration-button"
                color="red"
              >
                <FormattedMessage id="courseRegistration.cancel" />
              </ConfirmationButton>
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
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <Registration course={course} courseId={course.id} questions={course.questions} />
                </div>
              ) : null}
            </div>
          )}
      </div>
      <div>
        {course.questions && registrations && (user.role === roles.ADMIN_ROLE || (user.role === roles.STAFF_ROLE && course.teachers.find(t => t.id === user.id) !== undefined)) ? (
          <div>
            <CourseRegistration course={course} registrations={registrations} setRegistrations={setRegistrations} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
