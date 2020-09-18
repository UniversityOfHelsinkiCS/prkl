// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');
const users = require('../../../server/data/users');

describe('Student', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStudent();
    cy.fixture('courses').as('courses');
  });

  describe('access', () => {
    it('Can not see staff and admin views', () => {
      cy.visit('/addcourse');
      cy.contains('You do not have the required roles');
  
      cy.visit('/usermanagement');
      cy.contains('You do not have the required roles');
    });

    it('Cannot create a course', () => {
      cy.createCourse(0, 0).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

  });

  describe('course listing', () => {
    it('Can see the course listing', () => {
      cy.visit('/');
      cy.contains(courses[0].title);
    });
    
    it('Can not see an unpublished course', () => {
      cy.visit('/');
      cy.contains(courses[2].title).should('not.exist');
    });

    it('Can not see past courses', () => {
      cy.switchToStaff();
      cy.get('[data-cy="menu-item-add-course"]').click();
  
      cy.get('[data-cy="course-title-input"]').type('Past Course');
      cy.get('[data-cy="course-code-input"]').type('CYP999');
      cy.get('[data-cy="course-deadline-input"]').type('2019-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');
  
      cy.get('[data-cy="create-course-submit"]').click();
  
      cy.switchToStudent();
      cy.visit('/courses');
      cy.get('[data-cy="loader"]').should('not.exist');
      cy.contains('Past Course').should('not.exist');
    });
  
    it('Can not see deleted courses', () => {
      cy.switchToAdmin();
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
  
      cy.switchToStudent();
      cy.visit('/courses');
      cy.get('[data-cy="loader"]').should('not.exist');
      cy.contains(courses[0].title).should('not.exist');
    });

    it('Can not see staffcontrols', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').should('not.exist');
    });
  
  });

  describe('personal info', () => {
    it('Can see their personal info.', () => {
      cy.visit('/');
      cy.contains('Personal info').click();
      cy.url().should('include', '/user');
  
      cy.contains('Name:');
      cy.contains('Student number:');
      cy.contains('Email:');
    });

    it('Can see which courses they have enrolled to', () => {
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="confirm-button"]').click();
  
      cy.visit('/user');
      cy.contains(courses[0].title);
    });
  });

  describe('course enrolment', () => {
    it('Can enrol on a course', () => {
      const course = courses[1];
      cy.visit('/');
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
  
      cy.contains('Great success!');
  
      // Admin-role check for correct answers.
      cy.switchToAdmin();
      cy.visit(`/course/${course.id}`);
      for (const answer of answers) {
        cy.contains(answer);
      }
    });
  
    it('Can not enrol with answers missing', () => {
      cy.visit('/');
      cy.contains(courses[1].title).click();
  
      cy.get('[data-cy="submit-button"]').click();
  
      cy.get('[data-cy="confirm-button"]').should('not.exist');
      cy.contains('Please answer all questions!');
    });
  
    it('Can not enrol without accepting the privacy terms', () => {
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      // Cycle the checkbox on once to account for a past validation bug.
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="submit-button"]').click();
  
      cy.get('[data-cy="confirm-button"]').should('not.exist');
      cy.contains('Please answer all questions!');
    });
  
    it('Can not enrol twice on the same course', () => {
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="submit-button"]').click();
      cy.get('[data-cy="confirm-button"]').click();
  
      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.contains('Already registered!');
      cy.get('[data-cy="submit-button"]').should('not.exist');
    });
  });

});
