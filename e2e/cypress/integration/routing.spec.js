const courses = require('../fixtures/courses');

describe('Routing', () => {
  beforeEach(() => {
    cy.seedDatabase();
  });

  describe('Course page routing', () => {
    it('Course page routing for admin', () => {
      cy.switchToAdmin();

      cy.contains(courses[0].title).click();
      cy.url().should('include', `/course/${courses[0].id}`);

      // edit page
      cy.get('[data-cy="edit-course-button"]').click();
      cy.url().should('include', `/course/${courses[0].id}/edit`);
      cy.get('[data-cy="create-course-cancel"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.url().should('include', `/course/${courses[0].id}`);

      // groups page
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.url().should('include', `/course/${courses[0].id}/groups`);
      cy.get('[data-cy="back-to-info-from-groups-button"]').click();
      cy.url().should('include', `/course/${courses[0].id}`);

      // registrations page
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.url().should('include', `/course/${courses[0].id}/registrations`);
      cy.get('[data-cy="back-to-info-from-groups-button"]').click();
      cy.url().should('include', `/course/${courses[0].id}`);
    });

    // make one for staff and students
    // - they shouldn't see anything/be unable to access urls meant only for admins
  });
});
