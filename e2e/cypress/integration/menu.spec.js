// / <reference types="Cypress" />

describe('Menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Shows correctly for student', () => {
    cy.switchToStudent();
    cy.wait(300);
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('not.exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
		cy.get('[data-cy="mockbar"]').should('exist');
	});

  it('Shows correctly for staff', () => {
    cy.switchToStaff();
    cy.wait(300);
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
		cy.get('[data-cy="mockbar"]').should('exist');
	});

  it('Shows correctly for admin', () => {
    cy.switchToAdmin();
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
		cy.get('[data-cy="menu-item-privacy-toggle"]').should('exist');
		cy.get('[data-cy="mockbar"]').should('not.exist');
  });
});
