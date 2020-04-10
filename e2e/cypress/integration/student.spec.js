// / <reference types="Cypress" />

describe('Student', () => {
  beforeEach(() => {
    cy.resetDatabase();
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

  it('Can see the course listing', function () {
    cy.createCourse(0);
    cy.visit('/');
    cy.contains(this.courses[0].title);
  });

  it('Can enrol on a course', function () {
    cy.createCourse(0);
    cy.visit('/');
    cy.contains(this.courses[0].title).click();

    cy.get('[data-cy="question-0"]').type('Answer');
    cy.get('[data-cy="question-1"]').click();
    cy.contains('Second choice').click();

    cy.get('[data-cy="question-2"]').click();

    cy.get('[data-cy="question-2"]').contains('First choice').then(item => {
      item.click();
    });

    cy.get('[data-cy="toc-checkbox"]').click();
    cy.get('[data-cy="submit-button"]').click();
    cy.get('[data-cy="confirm-button"]').click();

    cy.contains('Great success!');
  });

  it('Can not enrol with answers missing', function () {
    cy.createCourse(0);
    cy.visit('/');
    cy.contains(this.courses[0].title).click();

    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="confirm-button"]').should('not.exist');
    cy.contains('Please answer all questions!');
  });
});
