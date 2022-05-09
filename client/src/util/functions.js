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
  '#D1C4E9',
  '#E1BEE7',
  '#F8BBD0',
  '#FFCDD2',
  '#FFCCBC',
  '#FFE0B2',
  '#FFECB3',
  '#DCEDC8',
  '#C8E6C9',
  '#B2DFDB',
  '#B2EBF2'

]

const colorChoice = {};
const questionsForChips = [];

export default qa => {
  qa.question.questionChoices.map(question => {
    if (!colorChoice[question.order]) {
      colorChoice[question.order] = colors.pop();
    }
  })

  switch (qa.question.questionType) {
    
    //TÄÄ ON RUMA RATKAISU MUTTA TOIMII TEHKÄÄ PAREMPI, UNIIKKI AVAIN PITÄISI KYHÄTÄ VIELÄ
    case 'multipleChoice':
      qa.question.questionChoices.map(question => {
        questionsForChips[question.order]=undefined
      })
      const sorted = [...qa.answerChoices].sort((a, b) => a.order > b.order);
      sorted.map(question => {
        questionsForChips[question.order]=question
      })
      return (
        <TableCell key={qa.id}>
          {questionsForChips.map(question => {
            if (question !== undefined){
              return (
                <Chip style={{ width:'100px', margin:'2px', backgroundColor: colorChoice[question.order] }} 
                  label={question.content} key={question.id} />
              )
            } else{
              return (
                <Chip style={{ width:'100px', margin:'2px', backgroundColor: 'transparent' }}key={question}  />
              )
            }

          })}
        </TableCell>
      );
    case 'singleChoice':
      return (
        
        <TableCell key={qa.id}>
          {qa.answerChoices[0] !== undefined ? 
            <Chip style={{ width:'100px', margin:'2px', backgroundColor: colorChoice[qa.answerChoices[0].order] }} 
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
