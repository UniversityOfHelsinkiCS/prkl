/// <reference types="Cypress" />

const apiUrl = Cypress.env("API_URL") || "";

// Database operations.
Cypress.Commands.add("resetDatabase", () => {
  cy.request("GET", `${apiUrl}/reset`);
});

// Commands to switch user roles.
const switchUser = (index) => {
  cy.request('POST', `${apiUrl}/switchUser`, { index });
};

Cypress.Commands.add('switchToStudent', () => switchUser(0));
Cypress.Commands.add('switchToStaff', () => switchUser(1));
Cypress.Commands.add('switchToAdmin', () => switchUser(2));
