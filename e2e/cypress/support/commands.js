// / <reference types="Cypress" />

const apiUrl = Cypress.env('API_URL') || '';

// Database operations.
Cypress.Commands.add('resetDatabase', () => {
  cy.request('GET', `${apiUrl}/reset`);
});

Cypress.Commands.add('createCourse', (index) => {
  cy.fixture('courses').then((courses) => {
    const body = {
      operationName: 'createCourse',
      variables: {
        data: courses[index],
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
        headers: headers[1],
      });
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
