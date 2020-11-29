const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Editing an existing course', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
    cy.visit('/');
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  })

  describe('Admin', () => {
    beforeEach(() => {
      cy.switchToAdmin();
    });

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
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.contains('Course from Cypress Edited').click();
      cy.contains('New description for course');
    });

    it('Correct teachers are chosen in advance when course is being edited', () => {
      cy.visit('/courses');
      // staff, not admin
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname).children().should('have.class', 'delete icon');
      cy.get('[data-cy="teacher-dropdown"]').click().contains(users[2].firstname).children().should('not.exist');

      cy.visit('/courses');
      // not staff, admin
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname).children().should('have.class', 'delete icon');
      cy.get('[data-cy="teacher-dropdown"]').click().contains(users[1].firstname).children().should('not.exist');

      cy.visit('/courses');
      // both staff and admin
      cy.contains(courses[7].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname).children().should('have.class', 'delete icon');
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname).children().should('have.class', 'delete icon');
      
    });

    it('Cannot remove all teachers from course', () => {
      cy.visit('/courses');
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
  
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname).children().should('have.class', 'delete icon').click();
  
      cy.visit('/courses');
      cy.get('[data-cy="TC02"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("exist");
      });
    });
  
    it('Can only edit textual content of existing questions in a published course', () => {
      const course = courses[1];
      const testTitle = 'test title';
      const testChoice = 'test choice';
  
      cy.visit('/courses');
      cy.wait(300);
      cy.contains(course.title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
      cy.get('[data-cy="question-remove-button"]').should('not.exist');
      cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
      cy.get('[data-cy="remove-question-choice-button"]').should('not.exist');
  
      cy.get('[data-cy="question-title"]').first().type('{selectall}{backspace}').type(testTitle);
      cy.get(`[data-cy="question-1-choice-1"]`).type('{selectall}{backspace}').type(testChoice);
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
  
      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="coursepage-question"]').should('have.length', 3);
      cy.get('[data-cy="coursepage-question"]').first().contains(testTitle).should('exist');
      cy.get('[data-cy="question-1"]').contains(testChoice).should('exist');
  
    });
    
    it('Can delete any course', () => {
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');
    
      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[4].title).should('not.exist');
    });

    it('Can make deadline past immediately', () => {
      // deadline is past
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-deadline-control"]').click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');
    });
  });

});
