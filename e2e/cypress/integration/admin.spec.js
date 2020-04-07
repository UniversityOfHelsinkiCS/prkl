/// <reference types="Cypress" />

describe("Admin", () => {
  beforeEach(() => {
    cy.resetDatabase();
  });

  it("Can create and delete a course", () => {
    cy.switchToAdmin();
    cy.visit("/");

    cy.contains("Add Course").click();

    //cy.get("[data-cy='add-course']").click();
  });
});
