// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Staff', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('course listing', () => {
    it('Can see an unpublished course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title);
    });
  
    it('Can see staffcontrols', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
    });
  
    it('Can toggle to see only own courses', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[1].title).should('not.exist');
    });

    it('Can toggle to see past courses', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');
    });

    it('Can toggle combo', () => {
      cy.visit('/courses');

      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('exist');
      cy.contains(courses[1].title).should('not.exist');
      cy.contains(courses[2].title).should('exist');
      cy.contains(courses[3].title).should('exist');

      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('not.exist');

      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[1].title).should('exist');
    });

  });

  describe('create course', () => {
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
});
