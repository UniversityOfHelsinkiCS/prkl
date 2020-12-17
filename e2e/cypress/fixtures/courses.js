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
  {
    id: "283df2a6-51e7-434f-a4b6-08514579a9ea",
    title: "Test Course for Algorithm",
    deadline: "2100-12-31",
    code: "TC10",
    description: "Description for a test course.",
    teachers: [userData[1]],
    maxGroupSize: 10,
    minGroupSize: 5,
    published: true,
    questions: [ 
      {
        id:"4cc2324a-3b5a-4201-9a04-6333521fcac9",
        questionType: "times",
        content: "Merkitse aikatauluun sinulle sopivat työskentelyajat.",
        order: 2,
      }
    ],
    registrations: [
      {
        id: "bc385120-cf53-4fc2-a2b6-e7dc8bd6d233",
        student: userData[0],
        workingTimes: [ 
          {
            id: "2fdadf42-f7f6-4746-a858-2901c24a7eda",
            startTime: "1970-01-05T12:00:00.000Z",
            endTime: "1970-01-05T13:00:00.000Z",
            registrationId: "bc385120-cf53-4fc2-a2b6-e7dc8bd6d233",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: true
          },
          {
            id: "4d0b290c-1712-46e7-a5ac-3e981bac3335",
            startTime: "1970-01-05T13:00:00.000Z",
            endTime: "1970-01-05T18:00:00.000Z",
            registrationId: "bc385120-cf53-4fc2-a2b6-e7dc8bd6d233",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
        ]
      },
      {       
        id: "23ebceeb-d2df-49e2-ac89-650e89ef3e28",
        student: userData[1],
        workingTimes: [
          {
            id: "8920f8ab-8414-4a4b-b360-36020d47b31e",
            startTime: "1970-01-09T12:00:00.000Z",
            endTime: "1970-01-09T13:00:00.000Z",
            registrationId: "23ebceeb-d2df-49e2-ac89-650e89ef3e28",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "68d27eeb-111c-4aea-8a64-abf90db5ecbf",
            startTime: "1970-01-05T13:00:00.000Z",
            endTime: "1970-01-05T18:00:00.000Z",
            registrationId: "23ebceeb-d2df-49e2-ac89-650e89ef3e28",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "1e5e8587-af41-432d-a0ad-53e2f01a645b",
            startTime: "1970-01-09T18:00:00.000Z",
            endTime: "1970-01-09T20:00:00.000Z",
            registrationId: "23ebceeb-d2df-49e2-ac89-650e89ef3e28",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "555c2d12-4170-41f1-bb66-1a94268b4e08",
            startTime: "1970-01-06T10:00:00.000Z",
            endTime: "1970-01-06T18:00:00.000Z",
            registrationId: "23ebceeb-d2df-49e2-ac89-650e89ef3e28",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
        ]
      },
      {        
        id: "e65d2919-e0f3-4466-b97d-987301a6af4d",
        student: userData[2],
        workingTimes: [ 
          {
            id: "399a5e62-daf3-4cc4-8332-d5c5239cf6d7",
            startTime: "1970-01-05T10:00:00.000Z",
            endTime: "1970-01-05T18:00:00.000Z",
            registrationId: "e65d2919-e0f3-4466-b97d-987301a6af4d",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "27f83899-64c5-4e6c-9cc5-ef4097b42aa6",
            startTime: "1970-01-10T18:00:00.000Z",
            endTime: "1970-01-10T20:00:00.000Z",
            registrationId: "e65d2919-e0f3-4466-b97d-987301a6af4d",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "636aae30-0ba1-4283-99c3-cb94e87af762",
            startTime: "1970-01-11T10:00:00.000Z",
            endTime: "1970-01-11T18:00:00.000Z",
            registrationId: "e65d2919-e0f3-4466-b97d-987301a6af4d",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
        ]
      },
      {        
        id: "df24fbbe-a93c-42a0-81f1-79df728879f7",
        student: userData[3],
        workingTimes: [ 
          {
            id: "23c38a02-e1ef-4308-b90e-2b44dc67c67a",
            startTime: "1970-01-07T10:00:00.000Z",
            endTime: "1970-01-07T12:00:00.000Z",
            registrationId: "df24fbbe-a93c-42a0-81f1-79df728879f7",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "a9c9fac9-70a7-4b21-8521-8f2941c3a1e1",
            startTime: "1970-01-10T12:00:00.000Z",
            endTime: "1970-01-10T15:00:00.000Z",
            registrationId: "df24fbbe-a93c-42a0-81f1-79df728879f7",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "65c4b943-a811-4139-9777-30a983fe41aa",
            startTime: "1970-01-10T15:00:00.000Z",
            endTime: "1970-01-10T20:00:00.000Z",
            registrationId: "df24fbbe-a93c-42a0-81f1-79df728879f7",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "2c982f52-2a06-41a3-8eff-5d47ebcf76e1",
            startTime: "1970-01-08T06:00:00.000Z",
            endTime: "1970-01-08T10:00:00.000Z",
            registrationId: "df24fbbe-a93c-42a0-81f1-79df728879f7",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
          {
            id: "0243a017-24cc-4fe2-9795-873c9396b265",
            startTime: "1970-01-08T10:00:00.000Z",
            endTime: "1970-01-08T11:00:00.000Z",
            registrationId: "df24fbbe-a93c-42a0-81f1-79df728879f7",
            questionId: "4cc2324a-3b5a-4201-9a04-6333521fcac9",
            tentative: false
          },
        ]
      },
    ]
  },
];

module.exports = defaultCourses;