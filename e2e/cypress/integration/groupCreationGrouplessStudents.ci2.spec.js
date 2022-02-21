/* eslint-disable cypress/no-unnecessary-waiting */
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Group creation', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('teacher', () => {
    const course = courses[3];


    it('Groupless students section contains all students before groups are generated', () => {
      cy.visit(`/course/${course.id}`);
      cy.wait(500);
      cy.get('[data-cy="manage-groups-button"]').click();

      cy.get('[data-cy="groupless-container"]').within(() => {
        cy.get('tr').should('have.length', users.length + 1);
        for (let i = 0; i < users.length; i++) {
          cy.contains(users[i].firstname);
        }
      });
    });

    it('Groupless students section is empty after generating new groups', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(300);

      cy.get('[data-cy="groupless-container"]').should('not.exist');
    });

    it('Students removed from groups are shown in groupless students', () => {
      const groupToRemoveFrom = 'Remove';
      const user = users[0];

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(user.firstname).parents('[data-cy="group-container"]').within(() => {
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToRemoveFrom}`);

      cy.contains(user.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click({ force: true });
      });

      cy.contains(groupToRemoveFrom)
        .parents('[data-cy="group-container"]')
        .should('not.contain', user.firstname);

      cy.get('[data-cy="groupless-container"]').contains(user.firstname);
    });

    it('Groupless students are updated when canceling changes', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      // generate new groups
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // remove student from group
      cy.contains(users[0].firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      // click cancel
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check that groupless contains all students
      cy.get('[data-cy="groupless-container"]').within(() => {
        cy.get('tr').should('have.length', users.length + 1);
        for (let i = 0; i < users.length; i++) {
          cy.contains(users[i].firstname);
        }
      });

      // generate new groups
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // save
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(300);

      // remove student
      cy.contains(users[0].firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      // cancel
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check that groupless is empty
      cy.get('[data-cy="groupless-container"]').should('not.exist');
    });

    it('Can use find group for all groupless students', () => {
      const course9 = courses[9];
      const user0 = users[0];
      const user2 = users[2];

      cy.visit(`/course/${course9.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(user0.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.contains(user2.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.get('[data-cy="target-group-size"]').within(() => {
        cy.get('input').clear();
        cy.get('input').type('2');
      });

      cy.get('[data-cy="find-group-for-all-button"]').click();

      cy.wait(500);

      cy.get('[data-cy="groupless-container"]').should('not.exist');

      cy.contains(user0.firstname)
        .parents('[data-cy="group-container"]');

      cy.contains(user2.firstname)
        .parents('[data-cy="group-container"]');
    });


  });
});
