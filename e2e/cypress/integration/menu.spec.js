// / <reference types="Cypress" />

describe('Menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Shows right for student', () => {
    cy.switchToStudent();
    cy.wait(500);
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('not.exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
  });

  it('Shows right for staff', () => {
    cy.switchToStaff();
    cy.wait(500);
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
  });

  it('Shows right for admin', () => {
    cy.switchToAdmin();
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('exist');
  });
});
