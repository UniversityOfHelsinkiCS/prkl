import React from "react";
import {Table} from "semantic-ui-react";
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