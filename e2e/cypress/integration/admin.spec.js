// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Admin', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  describe('course listing', () => {
    it('Can see an unpublished course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title);
    });

    it('Can see staffcontrols', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').should('exist')
    });
  
    it('Can toggle to see only own courses', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('not.exist');
    });

    it('Can toggle to see past courses', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');
    });

    it('Can toggle combo', () => {
      cy.visit('/courses');

      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');

      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('not.exist');
      cy.contains(courses[1].title).should('exist');
      cy.contains(courses[2].title).should('not.exist');
      cy.contains(courses[3].title).should('not.exist');

    });
  });

});
