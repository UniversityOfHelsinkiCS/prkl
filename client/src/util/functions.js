import React from 'react';
import { TableCell, Chip } from '@material-ui/core';
import { concat } from 'lodash';


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
  '#9FA8DA',
  '#9b59b6',
  '#5bb1eb',
  '#2ecc71',
  '#53d4ba',
  '#e8a335',
  '#f1c40f',
  '#ed7568',
  '#898ff5',
  '#f78fb3',
  '#27cfc7',
  '#B2EBF2',
];

const keyValue = {};
const otherColor = {};
export default qa => {
  qa.answerChoices.map(question => {
    if (!otherColor[question.order]) {
      otherColor[question.order] = colors.pop();
    }
  })
  switch (qa.question.questionType) {

    case 'multipleChoice':
      return (
        <TableCell key={qa.id}>
          
          {qa.answerChoices.map(question => {
            return (
              <Chip style={{ margin:'2px', backgroundColor: otherColor[question.order] }} 
                label={question.content} key={question.id} />
            )
          })}
        </TableCell>
      );
    case 'singleChoice':
      return (
        
        <TableCell key={qa.id}>
          {qa.answerChoices[0] !== undefined ? 
            <Chip style={{margin:'5px', backgroundColor: otherColor[qa.answerChoices[0].order] }} 
              label={qa.answerChoices[0].content} key={qa.answerChoices[0].id} />
          : ''}
        </TableCell>
      );
    case 'freeForm':
      return <TableCell key={qa.id}>{qa.content !== undefined ? qa.content : ''}</TableCell>;
    default:
      return null;
  }
};
