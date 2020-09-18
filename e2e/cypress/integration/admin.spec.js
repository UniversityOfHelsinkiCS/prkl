// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');

describe('Admin', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  it('Can see an unpublished course', () => {
    cy.visit('/courses');
    cy.contains(courses[2].title);
  });
});
