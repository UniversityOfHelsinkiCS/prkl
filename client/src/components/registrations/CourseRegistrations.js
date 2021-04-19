/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext } from 'react';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import DateRangeIcon from '@material-ui/icons/DateRange';

import { CourseContext } from '../courses/Course';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import questionSwitch, { count } from '../../util/functions';
import { TIMES } from '../../util/questionTypes';
import ConfirmationButton from '../ui/ConfirmationButton';
import HourDisplay from '../misc/HourDisplay';
import Popup from '../ui/Popup';

const CourseRegistrations = ({ course, registrations, regByStudentId }) => {
  const intl = useIntl();
  const [privacyToggle] = useStore('toggleStore');
  const [notification, setNotification] = useStore('notificationStore');

  const { deleteRegistration } = useContext(CourseContext);

  const handleRegistrationRemoval = async studentIdToRemove => {
    try {
      await deleteRegistration({
        variables: { courseId: course.id, studentId: studentIdToRemove },
      });

      setNotification({
        type: 'success',
        message: intl.formatMessage({ id: 'courseRegistration.registrationRemoved' }),
        visible: true,
      });
    } catch (deletionError) {
      // eslint-disable-next-line no-console
      console.log('Error while deleting enrolled registration: ', deletionError);
    }
  };

  return (
    <div>
      <Typography variant="h5">
        <FormattedMessage id="courseRegistration.title" /> {registrations.length}
      </Typography>

      <TableContainer component={Paper}>
        <Table data-cy="registration-table">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="courseRegistration.firstName" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="courseRegistration.lastName" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="courseRegistration.studentNumber" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="courseRegistration.email" />
              </TableCell>
              {course.questions.some(q => q.questionType === TIMES) && (
                <TableCell>
                  <FormattedMessage id="courseRegistration.times" />
                </TableCell>
              )}
              {course.questions.map(
                question =>
                  question.questionType !== TIMES && (
                    <TableCell key={question.id}>{question.content}</TableCell>
                  )
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map(reg => (
              <TableRow key={reg.id} data-cy="student-registration-row">
                <TableCell>{reg.student.firstname}</TableCell>
                <TableCell>{reg.student.lastname}</TableCell>
                <TableCell>{privacyToggle ? dummyStudentNumber : reg.student.studentNo}</TableCell>
                <TableCell>{privacyToggle ? dummyEmail : reg.student.email}</TableCell>

                {course.questions.some(q => q.questionType === TIMES) && (
                  <TableCell>
                    <Popup
                      content={
                        !_.isEmpty(regByStudentId) && (
                          <HourDisplay
                            groupId={reg.student.id}
                            header={`${reg.student.firstname} ${reg.student.lastname}`}
                            students={1}
                            times={count([regByStudentId[reg.student.studentNo]])}
                          />
                        )
                      }
                    >
                      <DateRangeIcon color="primary" />
                    </Popup>
                  </TableCell>
                )}
                {reg.questionAnswers.map(qa => questionSwitch(qa))}
                <TableCell>
                  <ConfirmationButton
                    onConfirm={() => handleRegistrationRemoval(reg.student.id)}
                    modalMessage={`${intl.formatMessage({
                      id: 'courseRegistration.removeConfirmation',
                    })} (${reg.student.firstname} ${reg.student.lastname})`}
                    buttonDataCy="remove-registration-button"
                    color={red[500]}
                  >
                    <FormattedMessage id="courseRegistration.remove" />
                  </ConfirmationButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CourseRegistrations;
