import evaluateBoth from "../src/algorithm/evaluators/bothEvaluators";
import { Registration } from "../src/entities/Registration";
import { WorkingTimes } from "../src/entities/WorkingTimes";
import { createFakeRegistration, genericAnswerSet } from "./util/jestUtils";

describe("Both evaluators combined", () => {
  it("Scores zero with empty attributes", () => {
    const reg = new Registration();
    reg.workingTimes = [];
    reg.questionAnswers = [];

    expect(evaluateBoth([reg, reg])).toEqual(0);
  });

  it("Two people with exactly same answers and times scores 2", () => {
    const regs = [createFakeRegistration(genericAnswerSet[0]), createFakeRegistration(genericAnswerSet[0])];

    const times = [
      {
        endTime: new Date("1970-01-05T07:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
    ];

    regs[0].workingTimes = times;
    regs[1].workingTimes = times;

    expect(evaluateBoth(regs)).toEqual(2);
  });
});
