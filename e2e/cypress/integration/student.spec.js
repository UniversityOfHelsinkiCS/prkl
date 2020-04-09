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
});
