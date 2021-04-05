/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext } from 'react';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Popup, Icon, Button } from 'semantic-ui-react';

import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import questionSwitch, { count } from '../../util/functions';
import ConfirmationButton from '../ui/ConfirmationButton';
import { TIMES } from '../../util/questionTypes';
import HourDisplay from '../misc/HourDisplay';
import { useMutation } from '@apollo/client';
import { DELETE_REGISTRATION } from '../../GqlQueries';
import { CourseContext } from '../courses/Course';

<<<<<<< HEAD
=======
import { red } from '@material-ui/core/colors';

// import { useMutation } from 'react-apollo';
>>>>>>> 6505420274442e081b96631ecd3d20e603d72703
// import { DELETE_REGISTRATION } from '../../GqlQueries';

const CourseRegistrations = ({
  course,
  registrations,
  regByStudentId,
}) => {
  const intl = useIntl();
  const [privacyToggle] = useStore('toggleStore');

  const {deleteRegistration} = useContext(CourseContext);

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
              <Table.HeaderCell />
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
                    onConfirm={() => deleteRegistration({
                      variables: { courseId: course.id, studentId: reg.student.id },
                    })}
                    modalMessage={`${intl.formatMessage({
                      id: 'courseRegistration.removeConfirmation',
                    })} (${reg.student.firstname} ${reg.student.lastname})`}
                    buttonDataCy="remove-registration-button"
                    color={red[500]}
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
