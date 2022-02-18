import React from 'react';
import { TableCell, Chip } from '@material-ui/core';

/**
 * A parser that intakes a student's answer to a question, and outputs a jsx table row -element containing the parsed answer.
 * eg. an answer to a multiple choice question with all options "yes", "no" and "maybe" could look like
 * this: "||no|maybe|"
 * @param{QuestionAnswer} - an answer associated with a given registration
 */
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

const hours = 14;
// either 8 or 6 depending on the timezone
const first = 8;

export const getEmailsSeparatedBySemiColon = registrations => {
  const emails = registrations.map(reg => reg.student.email).reduce((a, b) => a + ';' + b);
  return emails;
};

export const count = registrations => {
  const times = [...Array(7)].map(() => [...Array(hours)].map(() => 0));
  // console.log('times begin:', times)

  if (registrations[0] === undefined ) {
    return null;
  }

  registrations.forEach(reg => {
    reg.workingTimes.forEach(time => {
      const start = new Date(time.startTime).getHours();
      const diff = new Date(time.endTime).getHours() - start;
      let day = new Date(time.startTime).getDay();

      // This because monday is 1 and sunday is 0
      if (day === 0) {
        day = 7;
      }
      day--;

      if (diff >= 1) {
        for (let i = 0; i <= diff - 1; i++) {
          times[day][start - first + i]++;
        }
      }
    });
  });
  // console.log('times:', times)

  return times;
};

export const timeParse = props => {
  const groupTimesMap = {};
  props.forEach(group => {
    groupTimesMap[group.id] = count(group.students.map(student => student.registrations[0]));
  });
  return groupTimesMap;
};

export default qa => {
  switch (qa.question.questionType) {
    case 'multipleChoice':
      return (
        <TableCell key={qa.id}>{qa.answerChoices.map(question => <Chip label={question.content} />)}</TableCell>
      );
    case 'singleChoice':
      return (
        <TableCell key={qa.id}>
          {qa.answerChoices[0] !== undefined ? qa.answerChoices[0].content : ''}
        </TableCell>
      );
    case 'freeForm':
      return <TableCell key={qa.id}>{qa.content !== undefined ? qa.content : ''}</TableCell>;
    default:
      return null;
  }
};
