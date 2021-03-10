import evaluateGroupByMultipleChoice from "../src/algorithm/evaluators/evaluateByMultipleChoice";
import { Registration } from "../src/entities/Registration";
import { QuestionChoice } from "../src/entities/QuestionChoice";

const answerChoiceTemplate = (choice: string, index: number): QuestionChoice => {
  return {
    content: choice,
    id: index.toString(),
    order: index,
  } as QuestionChoice;
};

/*
    The 2d array is interpreted as follows:
    [
        [],                             // answers to the first question
        ["a choice", "another choice"], // answers to the second question
        ["Javascript", ""],             // answers to the third question
    ]
*/
// TODO: Flexible solution for both multiple- and single-choice-questions and different booleans
const createFakeRegistration = (answers: string[][], useInGroupCreation: boolean): Registration => {
  return {
    questionAnswers: answers.map((choices, index) => ({
      answerChoices: choices.map((choice, choiceIndex) => answerChoiceTemplate(choice, choiceIndex)),
      question: { questionType: "multipleChoice", useInGroupCreation },
      questionId: index.toString(),
    })),
  } as Registration;
};

describe("evaluateByMultipleChoice", () => {
  it("returns 1 for identical answers with two registrations", () => {
    const registrations = [
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
  });

  it("returns 0.5 when half of answers are the same with two registrations", () => {
    const registrations = [
      createFakeRegistration([["firstChoice", "thirdChoice"]], true),
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0.5);
  });

  it("returns 0 when no answers are the same with two registrations", () => {
    const registrations = [
      createFakeRegistration([["firstChoice", "thirdChoice"]], true),
      createFakeRegistration([["secondChoice", "fourthChoice"]], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
  });

  it("returns 1 for identical answers with three registrations", () => {
    const registrations = [
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
      createFakeRegistration([["firstChoice", "secondChoice"]], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
  });

  it("returns 1 for identical answers with three registrations and two questions", () => {
    const registrations = [
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["firstChoice", "secondChoice"],
      ], true),
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["firstChoice", "secondChoice"],
      ], true),
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["firstChoice", "secondChoice"],
      ], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
  });

  it("returns 0.5 when one questions answers are identical and ones are not the same", () => {
    const registrations = [
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["firstChoice", "secondChoice"],
      ], true),
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["thirdChoice", "fourthChoice"],
      ], true),
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["fifthChoice", "sixthChoice"],
      ], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0.5);
  });

  it("returns 0 when the group has only one person", () => {
    const registrations = [
      createFakeRegistration([
          ["firstChoice", "secondChoice"],
          ["firstChoice", "secondChoice"],
      ], true),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
  });

  it("returns 0 when useswitch is false (for every question)", () => {
    const registrations = [
      createFakeRegistration([["firstChoice", "secondChoice"]], false),
      createFakeRegistration([["firstChoice", "secondChoice"]], false),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
  });
});
