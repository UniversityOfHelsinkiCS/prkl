// / <reference types="Cypress" />

describe('Student', () => {
  beforeEach(() => {
    cy.resetDatabase();
    cy.switchToStudent();
  });

  it('Can see their personal info.', () => {
    cy.visit('/');
    cy.contains('Personal info').click();
    cy.url().should('include', '/user');

    cy.contains('Name:');
    cy.contains('Student number:');
    cy.contains('Email:');
  });

  it('Can see the course listing', () => {
    cy.createCourse(0);
    cy.visit('/');
    cy.contains('Test Course 0');
  });

  it.only('Can enrol on a course', () => {
    cy.createCourse(0);
    cy.visit('/');
    cy.contains('Test Course 0').click();

    cy.get('[data-cy="toc-checkbox"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    cy.contains('Great success!');
  });
});
