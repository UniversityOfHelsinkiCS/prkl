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
    cy.visit('/');
    cy.contains(courses[1].title).click();

    cy.get('[data-cy="question-2"]').type('Answer');
    cy.get('[data-cy="question-0"]').click();
    cy.contains('Second choice').click();

    cy.get('[data-cy="question-1"]').click();
    cy.get('[data-cy="question-1"]').contains('First').then((item) => {
      item.click();
    });

    cy.get('[data-cy="toc-checkbox"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    cy.contains('Great success!');
  });

  it('Can not enrol with answers missing', () => {
    cy.visit('/');
    cy.contains(courses[1].title).click();

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
});
