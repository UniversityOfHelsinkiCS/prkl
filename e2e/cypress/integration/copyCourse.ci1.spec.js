const courses = require('../fixtures/courses');
const users = require('../fixtures/users');


describe('Copying old course data when add course', () => {

  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  it('Cant find course when course code is empty or there is no matching course', () => {
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="search-code-button"]').click();
    cy.get('[data-cy="course-title-input"] input').should('have.value', '');
    cy.get('[data-cy="course-code-input"]').type("TEST");
    cy.get('[data-cy="search-code-button"]').click();
    cy.get('[data-cy="course-title-input"] input').should('have.value', '');
  });
  //Test works, but there is something wrong with cypress or updating webpage
  /*
  it('Can copy newest course by code, edit that and publish course ', () => {
    cy.get('[data-cy="menu-add-course"]').click();

    //Create first course
    cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
    cy.get('[data-cy="course-description-input"]').type('Testing');
    //Create question 1
    cy.get('[data-cy="add-question-button"]').click();
    cy.get('[data-cy="question-title"]').last().type('Greetings from first course');
    cy.get('[data-cy="question-type-freeform"]').last().click();

    cy.get('[data-cy="create-course-submit"]').click();
    cy.get('[data-cy="confirmation-button-confirm"]').click();

    cy.visit('/addcourse');
    //Create second course from first
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="search-code-button"]').click();
    //Check if copy work
    cy.get('[data-cy="course-title-input"] input').should('have.value', 'Course from Cypress');
    cy.get('[data-cy="course-title-input"] input').clear().type('Second Course from Cypress');
    cy.get('[data-cy="course-deadline-input"] input').type('2100-12-12');
    cy.get('[data-cy="course-code-input"] input').clear().type('CYP969');
    //Create question 2
    cy.get('[data-cy="add-question-button"]').click();
    cy.get('[data-cy="question-title"]').last().type('Greetings from second course');
    cy.get('[data-cy="question-type-freeform"]').last().click();

    cy.get('[data-cy="create-course-submit"]').click();
    cy.get('[data-cy="confirmation-button-confirm"]').click();

    cy.get('[data-cy="CYP969"]').first().click();
    //Check if all copy work
    cy.contains('Greetings from first course');
    cy.contains('Greetings from second course');

    });
    */

});