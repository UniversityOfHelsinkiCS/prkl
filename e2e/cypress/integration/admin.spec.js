// / <reference types="Cypress" />
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Admin', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  })
	//it('manage users -view and functions', () => {
  //
  //});
	//describe('log in as user -feature', () => {
	//	it('')
	//});
});
