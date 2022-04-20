import evaluateGroupByMultipleChoice from "../src/algorithm/evaluators/evaluateByMultipleChoice";
import { createFakeRegistration, genericAnswerSet } from "./util/jestUtils";

// Check util/jestUtils.ts for more specific information
describe("evaluateByMultipleChoice", () => {
  it("returns 1 for identical answers with two registrations", () => {
    const registrations = [createFakeRegistration(genericAnswerSet[0]), createFakeRegistration(genericAnswerSet[0])];
    const regs2 = [createFakeRegistration(genericAnswerSet[2]), createFakeRegistration(genericAnswerSet[2])];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
    expect(evaluateGroupByMultipleChoice(regs2)).toEqual(1);
  });

  // TODO: Expected 0.5 Received: 1
  // it("returns 0.5 when half of answers are the same with two registrations", () => {
  //   const registrations = [createFakeRegistration(genericAnswerSet[0]), createFakeRegistration(genericAnswerSet[1])];

  //   expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0.5);
  // });

  it("returns 0 when no answers are the same with two registrations", () => {
    const registrations = [createFakeRegistration(genericAnswerSet[0]), createFakeRegistration(genericAnswerSet[2])];
    const registrations2 = [createFakeRegistration(genericAnswerSet[3]), createFakeRegistration(genericAnswerSet[4])];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
    expect(evaluateGroupByMultipleChoice(registrations2)).toEqual(0);
  });

  it("returns 1 for identical answers with three registrations", () => {
    const registrations = [
      createFakeRegistration(genericAnswerSet[1]),
      createFakeRegistration(genericAnswerSet[1]),
      createFakeRegistration(genericAnswerSet[1]),
    ];

    const registrations2 = [
      createFakeRegistration(genericAnswerSet[4]),
      createFakeRegistration(genericAnswerSet[4]),
      createFakeRegistration(genericAnswerSet[4]),
    ];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
    expect(evaluateGroupByMultipleChoice(registrations2)).toEqual(1);
  });

  // TODO: Expected 1 Received: 2
  // it("returns 1 for identical answers with three registrations and two questions", () => {
  //   const registrations = [
  //     createFakeRegistration(genericAnswerSet[5]),
  //     createFakeRegistration(genericAnswerSet[5]),
  //     createFakeRegistration(genericAnswerSet[5]),
  //   ];

  //   expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
  // });

  // TODO: Expected 0.6666666 Received: 1
  // it("returns 0.666... when 2/3 are the same selected options", () => {
  //   const registrations = [
  //     createFakeRegistration(genericAnswerSet[5]),
  //     createFakeRegistration(genericAnswerSet[8]),
  //     createFakeRegistration(genericAnswerSet[9]),
  //   ];

  //   expect(evaluateGroupByMultipleChoice(registrations)).toEqual(2 / 3);
  // });

  it("returns 0 when the group has only one person", () => {
    const registrations = [createFakeRegistration(genericAnswerSet[2])];
    const registrations2 = [createFakeRegistration(genericAnswerSet[4])];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
    expect(evaluateGroupByMultipleChoice(registrations2)).toEqual(0);
  });

  it("returns 0 when use-boolean is false (for every question)", () => {
    const registrations = [createFakeRegistration(genericAnswerSet[7]), createFakeRegistration(genericAnswerSet[7])];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(0);
  });

  it("returns 1 when use-boolean is false for second question for two regs with same selections", () => {
    const registrations = [createFakeRegistration(genericAnswerSet[6]), createFakeRegistration(genericAnswerSet[6])];

    expect(evaluateGroupByMultipleChoice(registrations)).toEqual(1);
  });
});
