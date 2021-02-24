import evaluateByWorkingHours from "../src/algorithm/evaluators/evaluateByWorkingHours";
import { Registration } from "../src/entities/Registration";
import { WorkingTimes } from "../src/entities/WorkingTimes";

describe("Evaluate by working hours", () => {
  it("returns a score of zero with empty timetables", () => {
    const reg1 = new Registration();
    const reg2 = new Registration();
    reg1.workingTimes = [];
    reg2.workingTimes = [];

    expect(evaluateByWorkingHours([reg1, reg2])).toEqual(0);
  });

  it("two people with exactly same working times scores 1", () => {
    const reg = new Registration();
    reg.workingTimes = [
      {
        endTime: new Date("1970-01-05T07:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
      {
        endTime: new Date("1970-01-10T20:00:00.000Z"),
        startTime: new Date("1970-01-10T06:00:00.000Z"),
      } as WorkingTimes,
    ];

    expect(evaluateByWorkingHours([reg, reg])).toEqual(1);
  });

  it("two people with 50% same times scores 0.5", () => {
    const reg1 = new Registration();
    const reg2 = new Registration();

    // Exactly four hours picked from whole list:
    reg1.workingTimes = [
      {
        endTime: new Date("1970-01-05T10:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
    ];
    // Also four hours picked from list from which 2 hours overlap with reg1's hours:
    reg2.workingTimes = [
      {
        endTime: new Date("1970-01-05T12:00:00.000Z"),
        startTime: new Date("1970-01-05T10:00:00.000Z"),
      } as WorkingTimes,
      {
        endTime: new Date("1970-01-05T08:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
    ];

    expect(evaluateByWorkingHours([reg1, reg2])).toEqual(0.5);
  });

  it("two people with no overlapping hours scores 0", () => {
    const reg1 = new Registration();
    const reg2 = new Registration();

    reg1.workingTimes = [
      {
        endTime: new Date("1970-01-05T10:00:00.000Z"),
        startTime: new Date("1970-01-05T06:00:00.000Z"),
      } as WorkingTimes,
    ];

    reg2.workingTimes = [
      {
        endTime: new Date("1970-01-05T14:00:00.000Z"),
        startTime: new Date("1970-01-05T10:00:00.000Z"),
      } as WorkingTimes,
    ];

    expect(evaluateByWorkingHours([reg1, reg2])).toEqual(0);
  });
});
