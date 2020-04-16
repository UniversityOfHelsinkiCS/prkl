// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Student', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStudent();
    cy.fixture('courses').as('courses');
  });

  it('Can see their personal info.', () => {
    cy.visit('/');
    cy.contains('Personal info').click();
    cy.url().should('include', '/user');

    cy.contains('Name:');
    cy.contains('Student number:');
    cy.contains('Email:');
  });

  it('Can see the course listing', () => {
    cy.visit('/');
    cy.contains(courses[0].title);
  });

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

  it('Can see which courses they have enrolled to', () => {
    cy.visit('/');
    cy.contains(courses[0].title).click();

    cy.get('[data-cy="toc-checkbox"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    cy.visit('/user');
    cy.contains(courses[0].title);
  });

  it('Can not see staff and admin views', () => {
    cy.visit('/addcourse');
    cy.contains('You do not have the required roles');

    cy.visit('/usermanagement');
    cy.contains('You do not have the required roles');
  });
});
