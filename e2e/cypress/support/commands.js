// / <reference types="Cypress" />

const apiUrl = Cypress.env('API_URL') || '';

// Database operations.
Cypress.Commands.add('resetDatabase', () => {
  cy.request('GET', `${apiUrl}/reset`);
});

Cypress.Commands.add('createCourse', () => {
  const query = `
  mutation {
    createCourse(data: {
      title: "aaaaa"
      code: "coooode"
      deadline: "2020-12-12"
      description: "bbbbb"
      maxGroupSize: 1
      minGroupSize: 1
      questions: []
    }) {
      id
    }
  }
  `;
  cy.request('POST', `${apiUrl}/graphql`, { query });
});

// Commands to switch user roles.
const switchUser = (role) => {
  cy.visit('/');
  cy.get(`[data-cy="switch-to-${role}"]`).click();
};

Cypress.Commands.add('switchToStudent', () => switchUser('student'));
Cypress.Commands.add('switchToStaff', () => switchUser('staff'));
Cypress.Commands.add('switchToAdmin', () => switchUser('admin'));
