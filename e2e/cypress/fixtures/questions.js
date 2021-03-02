const { v4: uuidv4 } = require('uuid');

// make timetable question!
const defaultQuestions = [
  {
    content: "Choose one",
    id: "150e561d-cf97-4cb2-b910-7faa0984800e",
    order: 0,
    optional: false,
    useInGroupCreation: true,
    questionType: "singleChoice",
    questionChoices: [
      {
        content: "Option 1",
        id: "17f5b5de-1472-4f52-bf81-9ffd1933fd91",
        order: 1,
      },
      {
        content: "Option 2",
        id: "a6e145da-e89d-4587-bc39-71a740cb8d41",
        order: 2,
      },
    ],
  },
  {
    content: "Choose multiple",
    id: "841201f7-8166-4a0e-a255-4015301af00d",
    order: 1,
    optional: false,
    useInGroupCreation: true,
    questionType: "multipleChoice",
    questionChoices: [
      {
        content: "Option 1",
        id: "b154e8ea-3060-4906-87a2-79d601e8563a",
        order: 1,
      },
      {
        content: "Option 2",
        id: "6a64cbb1-0bdd-40d6-bd90-95a51bd854e6",
        order: 2,
      },
      {
        content: "Option 3",
        id: "ccefff8f-c7ad-4432-bd20-35c0a2443cbc",
        order: 3,
      },
    ],
  },
];

module.exports = defaultQuestions;
