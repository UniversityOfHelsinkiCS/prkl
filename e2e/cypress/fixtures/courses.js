const userData = require("./users.js");
const { v4: uuidv4 } = require('uuid');

const courseFourRegs = userData.map(u => {
  return {
    id: uuidv4(),
    student: u
  }
});

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
    registrations: courseFourRegs,
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
  {
    id: "94de6cec-44f1-4c20-96b0-5ad09abbb052",
    title: "Test Course 6 unpublished by admin",
    deadline: "2100-12-31",
    code: "TC06",
    description: "Unpublished mock course by admin.",
    teachers: [userData[2]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: false,
  },
  {
    id: "201768a6-0653-11eb-adc1-0242ac120002",
    title: "Test Course 7 unpublished by staff",
    deadline: "2100-12-31",
    code: "TC07",
    description: "Another mock course by staff.",
    teachers: [userData[1]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: false,
    questions: [
      {
        questionType: "singleChoice",
        content: "Please choose one",
        order: 0,
        questionChoices: [
          {
            order: 0,
            content: "Choice 1",
          },
          {
            order: 1,
            content: "Choice 2",
          },
        ],
      },
      {
        questionType: "multipleChoice",
        content: "Choose one or more",
        order: 1,
        questionChoices: [
          {
            order: 0,
            content: "First of many",
          },
          {
            order: 1,
            content: "Second of many",
          },
          {
            order: 2,
            content: "Third of many",
          },
        ],
      },
    ],
  },
  {
    id: "4f6c1320-7f30-40d7-aac3-3a3800a0a7d3",
    title: "Test Course 8 unpublished by Staff and Admin",
    deadline: "2100-12-31",
    code: "TC08",
    description: "Description for a test course.",
    teachers: [userData[1], userData[2]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: false
  },
  {
    id: "4b06a7ab-a473-461e-b5f2-90b886798287",
    title: "Test Course 9 unpublished without registrations",
    deadline: "2000-12-31",
    code: "TC09",
    description: "Description for a test course.",
    teachers: [userData[1]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: false
  },
];

module.exports = defaultCourses;