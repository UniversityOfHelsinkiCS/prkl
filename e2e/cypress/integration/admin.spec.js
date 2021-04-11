// / <reference types="Cypress" />
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Admin', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  after(() => {
    cy.switchToAdmin();
    cy.seedDatabase();
  });

  it('Managing users', () => {
    cy.visit('/usermanagement');
    // privacy toggle
    cy.get('[data-cy="manage-user-1"]').contains(users[0].email);
    cy.get('[data-cy="menu-privacy-toggle"]').click();
    cy.get('[data-cy="manage-user-1"]').contains('dummy.mail@helsinki.fi');
    cy.get('[data-cy="manage-user-1"]').contains(users[0].email).should('not.exist');
    cy.get('[data-cy="staff-button-1"]').should('have.class', 'makeStyles-plainButtonMargin-15');
    cy.get('[data-cy="student-button-1"]').should('have.class', 'makeStyles-activeRole-14');
    // make student staff
    cy.get('[data-cy="staff-button-1"]').click();
    cy.get('[data-cy="staff-button-1"]').should('have.class', 'makeStyles-activeRole-14');
    cy.get('[data-cy="student-button-1"]').should('have.class', 'makeStyles-plainButtonMargin-15');
    // check that role of student changed
    cy.switchToStudent();
    cy.visit('/courses');
    // can see staff controls
    cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
    // can see an unpublished course
    cy.contains(courses[2].title).should('exist');
    cy.switchToAdmin();
    cy.visit('/usermanagement');
    // log in as student (shibbolethUid is '1')
    cy.get('[data-cy="log-in-as-1"]').click();
    cy.get('[data-cy="mockbar"]').contains(`${users[0].firstname} ${users[0].lastname}`);
    cy.visit('/user');
    cy.get('.mainContent').contains(`${users[0].firstname} ${users[0].lastname}`);
  });
});
