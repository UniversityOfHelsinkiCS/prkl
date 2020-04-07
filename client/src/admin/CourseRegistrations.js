import React from 'react';
import { Table } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const CourseRegistration = ({ course, registrations }) => {
  const mapshit = qa => {
    const formattedMultipleAnswers = ['|'];
    let currentAnswer = 0;

    if (qa.answerChoices.length !== 0) {
      for (let index = 1; index <= qa.question.questionChoices.length; index += 1) {
        if (
          currentAnswer >= qa.answerChoices.length ||
          index < qa.answerChoices[currentAnswer].order
        ) {
          formattedMultipleAnswers.push('|');
        } else {
          formattedMultipleAnswers.push(` ${qa.answerChoices[currentAnswer].content} |`);
          currentAnswer += 1;
        }
      }
    }

    return formattedMultipleAnswers;
  };

  const questionSwitch = qa => {
    switch (qa.question.questionType) {
      case 'multipleChoice':
        return mapshit(qa);
      case 'singleChoice':
        return qa.answerChoices[0].content;
      case 'freeForm':
        return qa.content;
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <h3>
          <FormattedMessage id="courseRegistration.title" />
        </h3>

        <Table>
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
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {registrations.map(reg => (
              <Table.Row key={reg.id}>
                <Table.Cell>{reg.student.firstname}</Table.Cell>
                <Table.Cell>{reg.student.lastname}</Table.Cell>
                <Table.Cell>{reg.student.studentNo}</Table.Cell>
                <Table.Cell>{reg.student.email}</Table.Cell>
                {reg.questionAnswers.map(qa => (
                  <Table.Cell key={qa.id}>{questionSwitch(qa)}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

export default CourseRegistration;
