// / <reference types="Cypress" />

describe('Student', () => {
  it('Can see their personal info.', () => {
    cy.resetDatabase();
    cy.switchToStudent();
    cy.visit('/');
    cy.contains('Personal info').click();
    cy.url().should('include', '/user');

    cy.contains('Name:');
    cy.contains('Student number:');
    cy.contains('Email:');
  });
});
