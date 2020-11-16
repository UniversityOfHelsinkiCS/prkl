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
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();

      // past courses
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');

      // toggle combo
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');
      cy.contains(courses[1].title).should('exist');
      cy.contains(courses[2].title).should('not.exist');
      cy.contains(courses[3].title).should('not.exist');
    });

    it('Can see tags on course listing', () => {
      cy.visit('/courses');
      cy.get('[data-cy="TC01"]').within(() => {
        cy.wait(500);
        cy.get('[data-cy="tag-own"]').should("not.exist");
        cy.get('[data-cy="tag-unpublished"]').should("not.exist");
        cy.get('[data-cy="tag-dl"]').should("not.exist");
        cy.get('[data-cy="tag-enrolled"]').should("not.exist");
      });
      
      cy.get('[data-cy="TC02"]').within(() => {
        cy.wait(500);
        cy.get('[data-cy="tag-own"]').should("exist");
        cy.get('[data-cy="tag-unpublished"]').should("not.exist");
        cy.get('[data-cy="tag-dl"]').should("not.exist");
        cy.get('[data-cy="tag-enrolled"]').should("not.exist");
      });
      
      cy.get('[data-cy="TC03"]').within(() => {
        cy.wait(500);
        cy.get('[data-cy="tag-own"]').should("not.exist");
        cy.get('[data-cy="tag-unpublished"]').should("exist");
        cy.get('[data-cy="tag-dl"]').should("not.exist");
        cy.get('[data-cy="tag-enrolled"]').should("not.exist");
      });
      
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.get('[data-cy="TC04"]').within(() => {
        cy.wait(500);
        cy.get('[data-cy="tag-own"]').should("not.exist");
        cy.get('[data-cy="tag-unpublished"]').should("not.exist");
        cy.get('[data-cy="tag-dl"]').should("exist");
      });
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

  describe('course management', () => {
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

  describe('enrollment management', () => {   
    it('Can remove enrollments from any course', () => {  
      // remove student from own course
      cy.visit('/courses');
			cy.contains(courses[4].title).click();
			cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
			cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname).should('not.exist');

      // remove student from other's course
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
			// check that admin sees list of enrollments
			cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname);
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname).should('not.exist');

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
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.switchToAdmin();
			cy.contains(courses[1].title).click();
			cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[0].firstname).should('not.exist');
    });
  });
});
