const courses = require('../../../../server/data/courses');
const users = require('../../../../server/data/users');

describe('Group publishing', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('student', () => {

    it('Can see published groups on the course page of a course he or she has registered to', () => {
      cy.switchToStaff();
      cy.visit(`/course/${courses[3].id}`);
      cy.get('[data-cy="switch-view-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // Groups are saved but not published
      cy.switchToStudent();
      cy.visit(`/course/${courses[3].id}`);
      cy.wait(500);
      cy.contains('Your group has been published:').should('not.exist');

      cy.switchToStaff();
      cy.visit(`/course/${courses[3].id}`);
      cy.get('[data-cy="switch-view-button"]').click();
      cy.get('[data-cy="publish-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.switchToStudent();
      cy.visit(`/course/${courses[3].id}`);
      cy.contains('Your group has been published:');
      cy.get('table').within(() => {
        cy.contains(users[0].firstname);
        cy.contains(users[0].lastname);
        cy.contains(users[0].email);
      });
    });

  });

});