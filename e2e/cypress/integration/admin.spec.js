// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');
const users = require('../../../server/data/users');

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

    it('Can use staffcontrols', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
      
      // only own courses
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('not.exist');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();

      // past courses
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');

      // toggle combo
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('not.exist');
      cy.contains(courses[1].title).should('exist');
      cy.contains(courses[2].title).should('not.exist');
      cy.contains(courses[3].title).should('not.exist');
    });
  });
  
  describe('course view', () => {
    it('Edit button exists', () => {
      cy.visit('/');
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="edit-course-button"]').should('exist');
    });

    it('Can edit course title and description', () =>{
      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-title-input"]').type('{selectall}{backspace}').type('Course from Cypress Edited');
      cy.get('[data-cy="course-description-input"]').type('{selectall}{backspace}').type('New description for course');
      cy.get('[data-cy="create-course-submit"]').click();
      cy.visit('/courses');
      cy.contains('Course from Cypress Edited').click();
      cy.contains('New description for course');
    });
  });

  describe('enrollment management', () => {   
    it('Can remove enrollments from any course', () => {  
      // remove student from own course
      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('table').contains(users[3].firstname).should('not.exist');

      // remove student from other's course
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      // check that admin sees list of enrollments
      cy.get('table').contains(users[3].firstname);
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('table').contains(users[3].firstname).should('not.exist');
    });
  });
});
