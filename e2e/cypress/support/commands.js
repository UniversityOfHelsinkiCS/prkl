// / <reference types="Cypress" />
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

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

Cypress.Commands.add('courseRegistration', (courseIndex, headerIndex) => {
  const body = {
    operationName: 'courseRegistration',
    variables: {
      courseId: courses[courseIndex].id,
    },
    query: `
    query courseRegistrations($courseId: String!) {
      courseRegistrations(courseId: $courseId) {
        id
      }
    }`
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

Cypress.Commands.add('createRegistration', (courseIndex, headerIndex) => {
  const body = {
    operationName: 'createRegistration',
    variables: {
      data: {
        courseId: courses[courseIndex].id,
        questionAnswers: [],
        workingTimes: []
      }
    },
    query: `
      mutation createRegistration($data: RegistrationInput!) {
      createRegistration(data: $data) {
        id
      }
    }
  `,
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

Cypress.Commands.add('deleteCourse', (courseIndex, headerIndex) => {
  const body = {
    operationName: 'deleteCourse',
    variables: {
      id: courses[courseIndex].id,
    },
    query: `
      mutation deleteCourse($id: String!) {
        deleteCourse(id: $id)
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

