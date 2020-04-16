const users = require("./users");

module.exports = [
  {
    id: "af4f17f3-9e1a-4724-aa5c-e8c5042909ec",
    title: "Test Course 1" + users[0].firstname,
    deadline: "2100-12-31",
    code: "TC01",
    description: "Description for a test course.",
    maxGroupSize: 10,
    minGroupSize: 5,
  },
  {
    id: "be2a695a-c3a4-4f25-b0b5-ac7d4854a5b1",
    title: "Test Course 2",
    deadline: "2100-12-31",
    code: "TC02",
    description: "Description for a test course.",
    maxGroupSize: 10,
    minGroupSize: 5,
    questions: [
      {
        questionType: "singleChoice",
        content: "What is your single choice?",
        order: 0,
        questionChoices: [
          {
            order: 0,
            content: "First choice",
          },
          {
            order: 1,
            content: "Second choice",
          },
        ],
      },
      {
        questionType: "multipleChoice",
        content: "What are your many choices?",
        order: 1,
        questionChoices: [
          {
            order: 0,
            content: "First or many choices",
          },
          {
            order: 1,
            content: "Second of many choices",
          },
        ],
      },
      {
        questionType: "freeForm",
        content: "How do you be?",
        order: 2,
      },
    ],
  },
];
