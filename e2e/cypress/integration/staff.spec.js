// / <reference types="Cypress" />

describe('Staff', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  it('Can create a course with no questions', () => {
    cy.get('[data-cy="menu-item-add-course"]').click();

    cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
    cy.get('[data-cy="course-description-input"]').type('Description for test course.');

    cy.get('[data-cy="create-course-submit"]').click();

    cy.visit('/courses');
    cy.contains('CYP999');
    cy.contains('Course from Cypress');
  });
});
