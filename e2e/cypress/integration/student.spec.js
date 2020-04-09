// / <reference types="Cypress" />

describe('Test for student user', () => {
  it('Student can see his personal info.', () => {
    cy.resetDatabase();
    cy.switchToStudent();
    cy.visit('/');
    cy.contains('Personal info').click();
    cy.url().should('include', '/user');

    cy.contains('Name:');
    cy.contains('Student number:');
    cy.contains('Email:');
  });

  it.only('testing', () => {
    cy.resetDatabase();
    cy.switchToStaff();
    cy.createCourse();
    cy.visit('/');
  });
});
