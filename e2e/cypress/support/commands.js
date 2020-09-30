// / <reference types="Cypress" />
const users = require('../../../server/data/users');
const courses = require('../../../server/data/courses');

const apiUrl = Cypress.env('API_URL') || '';

// Database operations.
Cypress.Commands.add('seedDatabase', () => {
  cy.request('GET', `${apiUrl}/seed`);
});

Cypress.Commands.add('createCourse', (courseIndex, headerIndex) => {
  cy.fixture('courses').then((courses) => {
    const body = {
      operationName: 'createCourse',
      variables: {
        data: courses[courseIndex],
      },
      query: `
        mutation createCourse($data: CourseInput!) {
          createCourse(data: $data) {
            id
        }}`,
    };

    cy.fixture('mockHeaders').then((headers) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/graphql`,
        body,
        headers: headers[headerIndex],
        failOnStatusCode: false,
      });
    });
  });
});

Cypress.Commands.add('deleteRegistration', (studentIndex, courseIndex, headerIndex) => {
  const body = {
    operationName: 'deleteRegistration',
    variables: {
      studentId: users[studentIndex].id, courseId: courses[courseIndex].id,
    },
    query: `
      mutation deleteRegistration($studentId: String!, $courseId: String!) {
        deleteRegistration(studentId: $studentId, courseId: $courseId)
      }`,
  };

  cy.fixture('mockHeaders').then((headers) => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/graphql`,
      body,
      headers: headers[headerIndex],
      failOnStatusCode: false,
    });
  });
});

// Commands to switch user roles.
const switchUser = (role) => {
  cy.visit('/');
  cy.get(`[data-cy="switch-to-${role}"]`).click();
};

Cypress.Commands.add('switchToStudent', () => switchUser('student'));
Cypress.Commands.add('switchToStaff', () => switchUser('staff'));
Cypress.Commands.add('switchToAdmin', () => switchUser('admin'));

