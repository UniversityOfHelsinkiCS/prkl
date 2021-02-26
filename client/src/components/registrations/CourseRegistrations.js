/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { Table, Popup, Icon, Button } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from 'react-apollo';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import { DELETE_REGISTRATION } from '../../GqlQueries';
import questionSwitch, { count } from '../../util/functions';
import ConfirmationButton from '../ui/ConfirmationButton';
import HourDisplay from '../misc/HourDisplay';
import { TIMES } from '../../util/questionTypes';

const CourseRegistrations = ({ course, registrations, setRegistrations, regByStudentId }) => {
  const intl = useIntl();
  const [privacyToggle] = useStore('toggleStore');
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);
  const courseId = course.id;

  const handleRegistrationDeletion = async student => {
    const studentId = student.id;
    const variables = { studentId, courseId };
    try {
      await deleteRegistration({
        variables,
      });
      const newRegs = registrations.filter(r => r.student.id !== studentId);
      setRegistrations(newRegs);
    } catch (deletionError) {
      console.log('error:', deletionError);
    }
  };

  const popupTimesDisplay = student => (
    <HourDisplay
      groupId={student.id}
      header={`${student.firstname} ${student.lastname}`}
      students={1}
      times={count([regByStudentId[student.studentNo]])}
    />
  );

  return (
    <>
      <div>
        <h3>
          <FormattedMessage id="courseRegistration.title" /> {registrations.length}
        </h3>

        <Table data-cy="registration-table">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <FormattedMessage id="courseRegistration.firstName" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="courseRegistration.lastName" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="courseRegistration.studentNumber" />
              </Table.HeaderCell>
              <Table.HeaderCell>
                <FormattedMessage id="courseRegistration.email" />
              </Table.HeaderCell>
              {course.questions.some(q => q.questionType === TIMES) ? (
                <Table.HeaderCell>
                  <FormattedMessage id="courseRegistration.times" />
                </Table.HeaderCell>
              ) : null}

              {course.questions.map(question =>
                question.questionType !== TIMES ? (
                  <Table.HeaderCell key={question.id}>{question.content}</Table.HeaderCell>
                ) : null
              )}
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {registrations.map(reg => (
              <Table.Row key={reg.id} data-cy="student-registration-row">
                <Table.Cell>{reg.student.firstname}</Table.Cell>
                <Table.Cell>{reg.student.lastname}</Table.Cell>
                <Table.Cell>
                  {privacyToggle ? dummyStudentNumber : reg.student.studentNo}
                </Table.Cell>
                <Table.Cell>{privacyToggle ? dummyEmail : reg.student.email}</Table.Cell>
                {course.questions.some(q => q.questionType === TIMES) ? (
                  <Popup
                    content={() => popupTimesDisplay(reg.student)}
                    trigger={
                      <Table.Cell>
                        <Button icon>
                          <Icon name="calendar alternate outline" color="blue" size="large" />
                        </Button>
                      </Table.Cell>
                    }
                  />
                ) : null}

                {reg.questionAnswers.map(qa => questionSwitch(qa))}
                <Table.Cell>
                  <ConfirmationButton
                    onConfirm={() => handleRegistrationDeletion(reg.student)}
                    modalMessage={`${intl.formatMessage({
                      id: 'courseRegistration.removeConfirmation',
                    })} (${reg.student.firstname} ${reg.student.lastname})`}
                    buttonDataCy="remove-registration-button"
                    color="red"
                  >
                    <FormattedMessage id="courseRegistration.remove" />
                  </ConfirmationButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default CourseRegistrations;
