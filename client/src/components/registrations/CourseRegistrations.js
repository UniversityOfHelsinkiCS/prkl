import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from 'react-apollo';
import { dummyEmail, dummyStudentNumber } from '../../util/privacyDefaults';
import { DELETE_REGISTRATION } from '../../GqlQueries';
import questionSwitch from "../../util/functions";
import ConfirmationButton from '../ui/ConfirmationButton';


const CourseRegistration = ({ course, registrations, setRegistrations }) => {
  const history = useHistory();
  const intl = useIntl();
  const [privacyToggle] = useStore('toggleStore');
  const [deleteRegistration] = useMutation(DELETE_REGISTRATION);
  const courseId = course.id;

  const handleRegistrationDeletion = async (student) => {
    const studentId = student.id;
    const studentNo = student.studentNo;
    const variables = { studentId, courseId };
    if (window.confirm(`Remove ${studentNo} from course?`)) {
      try {
        await deleteRegistration({
          variables
        });
        const newRegs = registrations.filter(r => r.student.id !== studentId);
        setRegistrations(newRegs);
      } catch (deletionError) {
        console.log('error:', deletionError);
      }
    }
  }

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
              {course.questions.map(question =>
                question.questionType !== 'times' ? (
                  <Table.HeaderCell key={question.id}>{question.content}</Table.HeaderCell>
                ) : null
              )}
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {registrations.map(reg => (
              <Table.Row key={reg.id}>
                <Table.Cell>{reg.student.firstname}</Table.Cell>
                <Table.Cell>{reg.student.lastname}</Table.Cell>
                <Table.Cell>
                  {privacyToggle ? dummyStudentNumber : reg.student.studentNo}
                </Table.Cell>
                <Table.Cell>{privacyToggle ? dummyEmail : reg.student.email}</Table.Cell>
                {reg.questionAnswers.map(qa => (questionSwitch(qa)))}
                <Table.Cell>
                  <ConfirmationButton
                    onConfirm={() => handleRegistrationDeletion(reg.student)}
                    modalMessage={intl.formatMessage({ id: "courseRegistration.removeConfirmation" }) + ' (' + reg.student.firstname + ' ' + reg.student.lastname + ')'}
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

export default CourseRegistration;
