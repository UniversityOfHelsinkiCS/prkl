// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Admin', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  after(() => {
    cy.seedDatabase();
  })

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
  describe('course view', () => {
    it('Edit button exists', () => {
      const course = courses[1];
      cy.visit('/');
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="edit-course-button"]').should('exist');
    });

    it('Can edit course title and description', () =>{
      const course = courses[1];
      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').first().click();
      cy.get('[data-cy="course-title-input"]').type('Course from Cypress Edited');
      cy.get('[data-cy="course-description-input"]').type('New description for course');
      cy.get('[data-cy="create-course-submit"]').first().click();
      cy.visit('/courses');
      cy.contains('Test Course 1 by StaffCourse from Cypress Edited');
    })
  })

});
