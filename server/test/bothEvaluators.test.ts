import evaluateBoth from "../src/algorithm/evaluators/bothEvaluators";
import { Registration } from "../src/entities/Registration";
import { WorkingTimes } from "../src/entities/WorkingTimes";

const createFakeRegistration = (answers: string[][]): Registration => {
  return {
    questionAnswers: answers.map((choices, index) => ({
      answerChoices: choices.map(choice => ({
        id: choice,
      })),
      question: { questionType: "multipleChoice" },
      questionId: index.toString(),
    })),
  } as Registration;
};

describe("Both evaluators combined", () => {
  it("Scores zero with empty attributes", () => {
    const reg = new Registration();
    reg.workingTimes = [];
    reg.questionAnswers = [];

    expect(evaluateBoth([reg, reg], "start", "end")).toEqual(0);
  });

  it("Two people with exactly same answers and times scores 2?", () => {
    const regs = [
      createFakeRegistration([["firstChoice", "secondChoice"]]),
      createFakeRegistration([["firstChoice", "secondChoice"]]),
    ];

    const times = [
      {
        endTime: new Date("1970-01-05T07:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
    ];

    regs[0].workingTimes = times;
    regs[1].workingTimes = times;

    expect(evaluateBoth(regs, "start", "end")).toEqual(2);
  });
});
