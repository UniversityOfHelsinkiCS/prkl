const userData = require("./demoUsers.js");

const demoCourses = [
  {
    id: "bf742c4f-b0c5-4151-9401-f9fc074db4b2",
    title: "Ohjelmistotuotanto syksy 2020",
    deadline: "2020-10-30",
    code: "TKT20006",
    description: "Ohjelmistotuotantokurssin pienryhmäjako. Pienryhmissä suoritetaan miniprojekti, joka simuloi ketterää ohjelmistokehitystä.",
    teachers: [userData[1], userData[2], userData[3], userData[4]],
    maxGroupSize: 6,
    minGroupSize: 4,
    published: true,
    questions: [
      {
        questionType: "times",
        content: "Merkitse aikatauluun sinulle sopivat työskentelyajat.",
        order: 2,
      },
      {
        id: "7a58308f-2c4f-46f3-b576-dc2918dc4a49",
        questionType: "singleChoice",
        content: "Mitä arvosanaa tavoittelet kurssilta?",
        order: 0,
        questionChoices: [
          {
            order: 0,
            content: "1",
          },
          {
            order: 1,
            content: "2",
          },
          {
            order: 2,
            content: "3",
          },
          {
            order: 3,
            content: "4",
          },
          {
            order: 4,
            content: "5",
          },
        ],
      },
      {
        questionType: "multipleChoice",
        content: "Mitä seuraavista ohjelmointikielistä hallitset?",
        order: 1,
        questionChoices: [
          {
            order: 0,
            content: "Java",
          },
          {
            order: 1,
            content: "Python",
          },
          {
            order: 2,
            content: "C++",
          },
          {
            order: 3,
            content: "COBOL",
          },
        ],
      },
    ],
    registrations: [
      {
        id: "4b96a634-5851-4eed-a59b-36f96582d89f",
        student: userData[0],
      }
    ],
  },
];

module.exports = demoCourses;
