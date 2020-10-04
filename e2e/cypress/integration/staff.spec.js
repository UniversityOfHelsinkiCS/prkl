// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');
const users = require('../../../server/data/users');

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
      // only own courses
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[1].title).should('not.exist');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      // past courses
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');
      // toggle combo
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
    });

    it('Can delete only own, unpublished course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.visit('/courses');
      cy.contains(courses[2].title).should('not.exist');

      // check that deleting other's courses won't work even from backend
      cy.deleteCourse(1, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
      cy.deleteCourse(5, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    })
  });

  describe('enroll management', () => {
    it('Can see enrolled students only on own course', () => {
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('table').contains(users[3].firstname);
      cy.contains("Students enrolled to the course:");

      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('table').should('not.exist');
      cy.contains("Students enrolled to the course:").should('not.exist');

      // Test that restrictions apply to backend too.
      cy.courseRegistration(4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

    it('Can remove enrollments only from own course', () => {  
      // remove student from own course
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('table').contains(users[3].firstname).should('not.exist');
  
      // can't remove student from other's course
      cy.deleteRegistration(3, 4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });
  });
});
