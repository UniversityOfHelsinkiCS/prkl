const userData = require("./users.js");

// Data in this file is used for running tests !!
const defaultCourses = [
  {
    id: "af4f17f3-9e1a-4724-aa5c-e8c5042909ec",
    title: "Test Course 1 by Staff",
    deadline: "2100-12-31",
    code: "TC01",
    description: "Description for a test course.",
    teachers: [userData[1]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
    registrations: [
      {
        id: "5328d54d-a643-4d64-b9ba-ce538167e128",
        student: userData[3],
      }
    ]
  },
  {
    id: "be2a695a-c3a4-4f25-b0b5-ac7d4854a5b1",
    title: "Test Course 2 by Admin",
    deadline: "2100-12-31",
    code: "TC02",
    description: "Description for a test course.",
    teachers: [userData[2]],
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
        questionChoices: []
      },
    ],
  },
  {
    id: "e75b4a63-8f1f-4380-869c-87df243a61b6",
    title: "Test Course 3 unpublished",
    deadline: "2100-12-31",
    code: "TC03",
    description: "Description for a test course.",
    teachers: [userData[1]],
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
    teachers: [userData[1]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
    registrations: [
      {
        id: "c867f368-fa39-4ed4-96b8-d97cecec2c98",
        student: userData[0],
      }
    ]
  },
  {
    id: "e22a9bbc-42af-4c9d-b6de-8ce322f8734b",
    title: "Simple test course 5 by Admin",
    deadline: "2030-12-31",
    code: "TC05",
    description: "Course for non-staff persons.",
    teachers: [userData[2]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
    registrations: [
      {
        id: "acae5b2f-3125-49d1-a900-adfdb9b253bf",
        student: userData[3],
      }
    ]
  },
];

module.exports = defaultCourses;
