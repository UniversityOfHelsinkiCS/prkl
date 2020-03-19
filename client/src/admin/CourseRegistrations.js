import React from 'react';
import { Table } from 'semantic-ui-react';

const CourseRegistration = ({ course, registrations }) => {
  const mapshit = qa => {
    console.log('qa:', qa);
    const formattedMultipleAnswers = ['|'];
    let currentAnswer = 0;

    if (qa.answerChoices.length !== 0) {
      for (let index = 1; index <= qa.question.questionChoices.length; index += 1) {
        console.log('currentAnswer:', currentAnswer);
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

    console.log('formattedMultipleAnswers:', formattedMultipleAnswers);

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
        <h3>Students enrolled to the course:</h3>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>First name</Table.HeaderCell>
              <Table.HeaderCell>Last name</Table.HeaderCell>
              <Table.HeaderCell>Student no.</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
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
