const userData = require("./users.js");

const defaultCourses = [
  {
    id: "af4f17f3-9e1a-4724-aa5c-e8c5042909ec",
    title: "Test Course 1 by Staff",
    deadline: "2100-12-31",
    code: "TC01",
    description: "Description for a test course.",
    teacher: userData[1],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
  },
  {
    id: "be2a695a-c3a4-4f25-b0b5-ac7d4854a5b1",
    title: "Test Course 2 by Admin",
    deadline: "2100-12-31",
    code: "TC02",
    description: "Description for a test course.",
    teacher: userData[2],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
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
            content: "First of many choices",
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
  {
    id: "e75b4a63-8f1f-4380-869c-87df243a61b6",
    title: "Test Course 3 unpublished",
    deadline: "2100-12-31",
    code: "TC03",
    description: "Description for a test course.",
    teacher: userData[1],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: false,
  },
  {
    id: "f57807b7-fc31-47b2-9e59-2e59fc0a9561",
    title: "Test Course 4 DL passed",
    deadline: "2000-12-31",
    code: "TC04",
    description: "Deadline has passed.",
    teacher: userData[1],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
  },
];

module.exports = defaultCourses;
