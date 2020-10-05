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

  it('Can only edit textual content of existing questions in a published course', () => {
    const course = courses[1];
    const testTitle = 'test title';
    const testChoice = 'test choice';

    cy.visit('/courses');
    cy.contains(course.title).click();
    cy.get('[data-cy="edit-course-button"]').click();

    cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
    cy.get('[data-cy="question-remove-button"]').should('not.exist');
    cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
    cy.get('[data-cy="remove-question-choice-button"]').should('not.exist');

    cy.get('[data-cy="question-title"]').first().type('{selectall}{backspace}').type(testTitle);
    cy.get(`[data-cy="question-1-choice-1"]`).type('{selectall}{backspace}').type(testChoice);
    cy.get('[data-cy="create-course-submit"]').click();

    cy.visit('/courses');
    cy.contains(course.title).click();
    cy.get('[data-cy="coursepage-question"]').should('have.length', 3);
    cy.get('[data-cy="coursepage-question"]').first().contains(testTitle).should('exist');
    cy.get('[data-cy="question-1"]').contains(testChoice).should('exist');

  });

  describe('course management', () => {
    it('Can delete any course', () => {
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.visit('/courses');
      cy.contains(courses[0].title).should('not.exist');
    
      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.visit('/courses');
      cy.contains(courses[4].title).should('not.exist');
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

      // remove student from course which contains questions and working times
      // gotta enroll to such course first... could make this easier
      cy.visit('/courses');
      cy.switchToStudent();
      const course = courses[1];
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="question-0"]').click();
      const answers = [course.questions[0].questionChoices[1].content];
      cy.contains(answers[0]).click();
  
      cy.get('[data-cy="question-1"]').click();
      answers.push(course.questions[1].questionChoices[1].content);
      cy.get('[data-cy="question-1"]').contains(answers[1]).then((item) => {
        item.click();
      });

      answers.push('My cool answer');
      cy.get('[data-cy="question-2"]').type(answers[2]); 
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="confirm-button"]').click();

      cy.visit('/courses');
      cy.switchToAdmin();
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('table').contains(users[0].firstname).should('not.exist');

    });
  });
});
