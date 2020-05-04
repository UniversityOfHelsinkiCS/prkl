import React from "react";
import {Table} from "semantic-ui-react";

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
// joko 8 tai 6 riippuen timezonesta
const first = 8;

export const count = registrations => {
  const times = [...Array(7)].map(() => [...Array(hours)].map(() => 0));
  // console.log('times begin:', times)
  registrations.forEach(reg => {
    reg.workingTimes.forEach(time => {
      const start = new Date(time.startTime).getHours();
      const diff = new Date(time.endTime).getHours() - start;
      let day = new Date(time.startTime).getDay();

      // Tämä koska maanantai on 1 ja sunnuntai 0
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
        return <Table.Cell key={qa.id}>{mapshit(qa)}</Table.Cell>;
      case 'singleChoice':
        return <Table.Cell key={qa.id}>{qa.answerChoices[0].content}</Table.Cell>;
      case 'freeForm':
        return <Table.Cell key={qa.id}>{qa.content}</Table.Cell>;
      default:
        return null;
    }
};
