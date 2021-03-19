import { User } from "../../src/entities/User";
import { Registration } from "../../src/entities/Registration";
import { QuestionChoice } from "../../src/entities/QuestionChoice";

// Used to initialize the passing of the JSON-object for TS
interface AnswerObject {
  answers: Array<Array<string>>;
  type: Array<string>;
  used: Array<boolean>;
}

// Mocking a realistic QuestionChoice. Used in creation of a fake registration (see below)
const answerChoiceTemplate = (choice: string, index: number): QuestionChoice => {
  return {
    content: choice,
    id: index.toString(),
    order: index,
  } as QuestionChoice;
};

// Used for testing the group sizes
export const createEmptyRegistration = (): Registration => {
  const reg = new Registration();
  reg.workingTimes = [];
  reg.questionAnswers = [];
  reg.student = new User();
  reg.student.id = "0";
  return reg;
};

/*
    The 2d array is interpreted as follows:
    [
        [],                             // answers to the first question
        ["a choice", "another choice"], // answers to the second question
        ["Javascript", ""],             // answers to the third question
    ]
*/
export const createFakeRegistration = (answerObject: AnswerObject): Registration => {
  return {
    questionAnswers: answerObject.answers.map((choices, index) => ({
      answerChoices: choices.map((choice, choiceIndex) => answerChoiceTemplate(choice, choiceIndex)),
      question: { questionType: answerObject.type[index], useInGroupCreation: answerObject.used[index] },
      questionId: index.toString(),
    })),
  } as Registration;
};

// Generation could be dynamically automated with a loop
export const genericAnswerSet = [
  {
    answers: [["firstChoice", "secondChoice"]],
    type: ["multipleChoice"],
    used: [true],
  },
  {
    answers: [["firstChoice", "thirdChoice"]],
    type: ["multipleChoice"],
    used: [true],
  },
  {
    answers: [["fourthChoice"]],
    type: ["multipleChoice"],
    used: [true],
  },
  {
    answers: [["firstChoice"]],
    type: ["singleChoice"],
    used: [true],
  },
  {
    answers: [["secondChoice"]],
    type: ["singleChoice"],
    used: [true],
  },
  {
    answers: [["thirdChoice", "fifthChoice"], ["fourthChoice"]],
    type: ["multipleChoice", "singleChoice"],
    used: [true, true],
  },
  {
    answers: [["firstChoice"], ["secondChoice", "fourthChoice"]],
    type: ["singleChoice", "multipleChoice"],
    used: [true, false],
  },
  {
    answers: [["firstChoice", "secondChoice", "thirdChoice"], ["firstSingleChoice"], ["secondSingleChoice"]],
    type: ["multipleChoice", "singleChoice", "singleChoice"],
    used: [false, false, false],
  },
  {
    answers: [["thirdChoice", "fifthChoice"], ["firstChoice"]],
    type: ["multipleChoice", "singleChoice"],
    used: [true, true],
  },
  {
    answers: [["thirdChoice", "fifthChoice"], ["secondChoice"]],
    type: ["multipleChoice", "singleChoice"],
    used: [true, true],
  },
];
