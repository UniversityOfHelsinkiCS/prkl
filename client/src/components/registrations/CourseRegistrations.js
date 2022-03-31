/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext } from 'react';
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
  Button,
} from '@material-ui/core';
import { red, green } from '@material-ui/core/colors';
import DateRangeIcon from '@material-ui/icons/DateRange';
import questionSwitch, { count, getEmailsSeparatedBySemiColon } from '../../util/functions';
import ConfirmationButton from '../ui/ConfirmationButton';
import { setNotification } from '../ui/Notification';
import CourseContext from '../courses/CourseContext';
import { TIMES } from '../../util/questionTypes';
import HourDisplay from '../misc/HourDisplay';
import Popup from '../ui/Popup';

const CourseRegistrations = ({ course, registrations, regByStudentId }) => {
  const intl = useIntl();

  const { deleteRegistration } = useContext(CourseContext);

  const handleRegistrationRemoval = async studentIdToRemove => {
    try {
      await deleteRegistration({
        variables: { courseId: course.id, studentId: studentIdToRemove },
      });
      setNotification(
        intl.formatMessage({ id: 'courseRegistration.registrationRemoved' }),
        'success'
      );
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
                <Button
                  style={{ backgroundColor: green[500] }}
                  onClick={() => {
                    navigator.clipboard.writeText(getEmailsSeparatedBySemiColon(registrations));
                  }}
                >
                  Copy All
                </Button>
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
                <TableCell>{reg.student.studentNo}</TableCell>
                <TableCell>{reg.student.email}</TableCell>

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
                {reg.questionAnswers
                  .map(x => x)
                  .sort((a, b) => a.question.order - b.question.order)
                  .map(qa => questionSwitch(qa))}
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
