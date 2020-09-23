// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Staff', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
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

  describe('editing existing course', () => {
    it('Can edit title, code, deadline and description of an unpublished course', () => {
      const newTitle = 'Title by staff member';
      const newCode = 'NewCode123';
      const newDate = '2050-04-23';
      const newDescription = 'Description by staff member';

      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-title-input"]').type('{selectall}{backspace}').type(newTitle);
      cy.get('[data-cy="course-code-input"]').type('{selectall}{backspace}').type(newCode);
      cy.get('[data-cy="course-deadline-input"]').type(newDate);
      cy.get('[data-cy="course-description-input"]').type('{selectall}{backspace}').type(newDescription);

      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(newTitle).click();
      cy.contains(newCode);
      // TODO: test set date too somehow, find a way to do reliably with intl
      cy.contains(newDescription);
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-published-checkbox"]').should('not.have.class', 'checked');
    })

    it('Can not edit course after publishing it', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-published-checkbox"]').click();
      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.contains('[data-cy="edit-course-button"]').should('not.exist');
    })

  })
});
