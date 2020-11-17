const courses = require('../../fixtures/courses');
const users = require('../../fixtures/users');
const { v4: uuidv4 } = require('uuid');

describe('Group publishing', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('student', () => {

    // This test is randomized!
    it('Can see published groups on the course page of a course they have registered to, with the right group members and correct group-specific message', () => {

      // Test 4 times with different random groups sizes...
      let iter = Array.from({ length: 4 }, (v, k) => k + 1);
      cy.wrap(iter).each((curr, i) => {
        const groupSize = Math.floor(Math.random() * (users.length - 2));
        let namesInGroup = [];
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

        // Set messages for groups
        cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(gc => {
          cy.get('[data-cy="group-message-input"]').within(() => {
            const randomString = uuidv4();
            cy.get('input').type(randomString);
            groupMessage = randomString;
          });
        }).then(() => {

          cy.get('[data-cy="save-groups-button"]').click();
          cy.get('[data-cy="confirmation-button-confirm"]').click();
          cy.wait(250);

          // This is becoming a promise hell of sorts
          // Get student(s) in the same group as the student
          cy.contains(users[0].firstname).parent().parent().children().each((el, i, l) => {
            const nameInTd = el.children().eq(0).text();
            namesInGroup.push(nameInTd);
          }).then(() => {

            // Groups are saved but not published
            if (i === 0) {
              cy.switchToStudent();
              cy.visit(`/course/${courses[3].id}`);
              cy.wait(500);
              cy.get('[data-cy="disabled-show-user-groups-button"]').should('exist');

              cy.switchToStaff();
              cy.visit(`/course/${courses[3].id}`);
              cy.get('[data-cy="manage-groups-button"]').click();
              cy.get('[data-cy="publish-groups-button"]').click();
              cy.get('[data-cy="confirmation-button-confirm"]').click();
            }

            cy.switchToStudent();
            cy.visit(`/course/${courses[3].id}`);
            cy.get('[data-cy="show-user-groups-button"]').click();
            cy.contains('Your group has a new message:');
            cy.contains(groupMessage);
            cy.contains('Your group has been published:');
            cy.get('table>tbody>tr').each(tr => {
              const fullName = tr.children().eq(0).text() + ' ' + tr.children().eq(1).text();
              expect(namesInGroup).to.include(fullName);
            });
            cy.get('table>tbody>tr').should('have.length', namesInGroup.length);
            cy.get('table').within(() => {
              cy.contains(users[0].firstname);
              cy.contains(users[0].lastname);
              cy.contains(users[0].email);
            });
          });

        });

      });

    });

  });

});