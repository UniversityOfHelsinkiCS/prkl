import React from 'react';
import { TableCell, Chip } from '@material-ui/core';


export const copyTextToClipboard = text => {
  if (text) {
    navigator.clipboard.writeText(text);
  }
};

const hours = 14;
// either 8 or 6 depending on the timezone
const first = 8;

export const getEmailsSeparatedBySemiColon = registrations => {
  const emails = registrations.map(reg => reg.student.email).reduce((a, b) => `${a};${b}`);
  return emails;
};

export const count = registrations => {
  const times = [...Array(7)].map(() => [...Array(hours)].map(() => 0));
  // console.log('times begin:', times)

  if (registrations[0] === undefined) {
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
      day -= 1;

      if (diff >= 1) {
        for (let i = 0; i <= diff - 1; i += 1) {
          times[day][start - first + i] += 1;
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

const colors = [
  '#34495e',
  '#9b59b6',
  '#3498db',
  '#2ecc71',
  '#16a085',
  '#f39c12',
  '#f1c40f',
  '#e74c3c',
  '#3742fa',
  '#f78fb3',
  '#079992',
  '#4a69bd',
];

const keyValue = {};

export default qa => {
  switch (qa.question.questionType) {
    case 'multipleChoice':
      return (
        <TableCell key={qa.id}>
          
          {qa.answerChoices.map(question => {
            if (!keyValue[question.content]) {
              keyValue[question.content] = colors.pop();
            }

            return (
              <Chip style={{ backgroundColor: keyValue[question.content] }} label={question.content} />
            )
          })}
        </TableCell>
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
