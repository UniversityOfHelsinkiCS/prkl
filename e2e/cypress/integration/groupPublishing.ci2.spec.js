/* eslint-disable cypress/no-unnecessary-waiting */
const { v4: uuidv4 } = require('uuid');
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Group publishing', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('student', () => {
    // Test 4 times with different groups sizes, generated groups are going to be random, of course
    for (let i = 0; i < 4; i++) {
      it(`Test ${i + 1}: Can see published groups on the course page of a course they have registered to, with the right group members and correct group-specific message`, () => {
        // const groupSize = Math.floor(Math.random() * (users.length - 2));
        const groupSize = i + 1;
        const namesInGroup = [];
        const groupName = 'TESTGROUP';
        let groupMessage = '';

        cy.switchToStaff();
        cy.visit(`/course/${courses[3].id}`);
        cy.get('[data-cy="manage-groups-button"]').click();
        cy.wait(250);
        cy.get('[data-cy="target-group-size"]').within(() => {
          cy.get('input').type(`{selectAll}${groupSize}`);
        });
        cy.get('[data-cy="create-groups-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();
        cy.wait(250);

        cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
          cy.get('[data-cy="group-name-label"]').click();
        });
        cy.wait(20);
        cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupName}`);

        // Set messages for groups
        cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
          cy.get('[data-cy="group-message-input"]').within(() => {
            const randomString = uuidv4();
            cy.get('input').type(randomString, { force: true });
            groupMessage = randomString;
          });
        }).then(() => {
          cy.get('[data-cy="save-groups-button"]').click({ force: true });
          cy.get('[data-cy="confirmation-button-confirm"]').click({ force: true });

          cy.wait(250);

          // This is becoming a promise hell of sorts
          // Get student(s) in the same group as the student
          cy.contains(users[0].firstname).parent().parent().parent()
            .parent()
            .children()
            .each((el) => {
              const nameInTd = el.children().eq(0).text();
              namesInGroup.push(nameInTd);
            })
            .then(() => {
              // Groups are saved but not published
              cy.switchToStudent();
              cy.visit(`/course/${courses[3].id}`);
              cy.wait(500);
              cy.contains('Groups are still under construction...')
              cy.contains('If you want to cancel your registration, please contact course teacher.')

              cy.switchToStaff();
              cy.visit(`/course/${courses[3].id}`);
              cy.get('[data-cy="manage-groups-button"]').click();
              cy.get('[data-cy="publish-groups-button"]').click();
              cy.get('[data-cy="confirmation-button-confirm"]').click();

              cy.switchToStudent();
              cy.visit(`/course/${courses[3].id}`);
              cy.contains(`Message for ${groupName}`);
              cy.contains(users[0].firstname);
              cy.contains(users[0].lastname);
              cy.contains(users[0].email);
            });
        });
      });
    }
  });
});

