const randomlist = (n: number, max: number): string[] => {
  const unique = {};
  while (Object.keys(unique).length < n) {
    const r1 = Math.floor(Math.random() * max) + 1;
    unique[r1] = true;
  }
  return Object.keys(unique);
};

const createRandomTimes = (): any => {
  const list = [];
  const id = "ea123eb4-a80b-40da-ae91-5e7eac73641c";

  for (let day = 0; day < 7; day++) {
    let start = 8;
    let end = 9;
    let old = Math.floor(Math.random() * 3);

    while (start < 22) {
      const time = Math.floor(Math.random() * 14) + 1;
      end = Math.min(start + time, 22);
      const startTime = new Date(1970, 0, day + 5, start, 0);
      const endTime = new Date(1970, 0, day + 5, end, 0);
      start = end + 1;

      let tentative = Math.floor(Math.random() * 3);

      // Make it so the next timeslot cannot be of the same type as the previous
      while (tentative === old) {
        tentative = Math.floor(Math.random() * 3);
      }

      old = tentative;

      if (tentative < 1) {
        // Do nothing: time is not acceptable
      } else if (tentative < 2) {
        // Tentative true
        list.push({ startTime, endTime, tentative: true, id });
      } else {
        // Tentative false
        list.push({ startTime, endTime, tentative: false, id });
      }
    }
  }

  return list;
};

const mod = (index: number): any => {
  const modded = {
    student: {
      firstname: "firstname ".concat(index.toString()),
      lastname: "lastname ".concat(index.toString()),
      studentNo: "1001100-".concat(index.toString()),
    },
    workingTimes: createRandomTimes(),
    questionAnswers: [
      {
        questionId: "ea89deb4-a80b-40da-ae91-5e7bac73641c",
        question: {
          questionType: "multipleChoice",
          content: "multiple 1",
        },
        choices: 4,
        answerChoices: [],
      },
      {
        questionId: "cfd6a8d7-c01f-4168-b747-3f71a5aaa2c0",
        question: {
          questionType: "multipleChoice",
          content: "multiple 2",
        },
        choices: 5,
        answerChoices: [],
      },
      {
        questionId: "1448885b-8001-4a4d-8f24-56d74f8bf7eb",
        question: {
          questionType: "singleChoice",
          content: "single 1",
        },
        choices: 3,
        answerChoices: [],
      },
      {
        questionId: "d906f155-81e0-4a9f-bcde-5d01bc42e77d",
        question: {
          questionType: "singleChoice",
          content: "single 2",
        },
        choices: 4,
        answerChoices: [],
      },
    ],
  };

  const m1 = Math.floor(Math.random() * 5);
  const m2 = Math.floor(Math.random() * 6);
  const s1 = Math.floor(Math.random() * 3) + 1;
  const s2 = Math.floor(Math.random() * 4) + 1;

  modded.questionAnswers[2].answerChoices.push({
    content: "choice ".concat(s1.toString()),
    order: s1,
  });
  modded.questionAnswers[3].answerChoices.push({
    content: "choice ".concat(s2.toString()),
    order: s2,
  });

  const m1random = randomlist(m1, 4);
  modded.questionAnswers[0].answerChoices = m1random.map(o => ({
    content: "choice ".concat(o),
    order: o,
  }));

  const m2random = randomlist(m2, 5);
  modded.questionAnswers[1].answerChoices = m2random.map(o => ({
    content: "choice ".concat(o),
    order: o,
  }));

  return modded;
};

export default (amount: number): any => {
  const data = [];
  for (let index = 1; index <= amount; index++) {
    const t = mod(index);
    data.push(t);
  }

  return data;
};
