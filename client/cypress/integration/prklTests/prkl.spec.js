//To run the tests, you need to compose via docker, start the client in
//dev mode and start up cypress.

describe("Test for student user", () => {
  it("Student can see his personal info.", () => {
    cy.visit("localhost:3000/")
    cy.contains("Student").click()
    cy.contains("Personal info").click()
    cy.url().should("include", "/user")
  })
  it("Student can list all available courses.", () => {
    cy.visit("localhost:3000/")
    cy.contains("Student").click()
    cy.contains("Courses").click()
    cy.url().should("include", "/courses")
  })
  it("Student can go back to the homepage.", () => {
    cy.visit("localhost:3000/")
    cy.contains("Personal info").click()
    cy.contains("PRKL").click()
    cy.contains(
      "Please aquaint yourself with the available projects through the courses tab. Happy grouping!"
    )
  })
})

describe("Test for admin user", () => {
  it("Fills out course form without questions, posts it, lists courses, removes course it added.", () => {
    cy.visit("localhost:3000/")
    cy.contains("Student").click()
    cy.contains("Admin").click()

    cy.contains("Add Course").click()

    cy.get(":nth-child(1) > .field > .ui > input").type(
      "super unique cypress test course title"
    )
    cy.get(":nth-child(2) > :nth-child(1) > .ui > input").type("TESTcode")
    cy.get(":nth-child(2) > :nth-child(2) > .ui > input").type("3000-01-01")

    cy.get("textarea").type("epic description")

    cy.get(":nth-child(4) > :nth-child(1) > .ui > input").type(2)
    cy.get(":nth-child(4) > :nth-child(2) > .ui > input").type(3)

    cy.get(":nth-child(5) > :nth-child(1) > .ui").click()
    cy.get(".segment > .required > .ui > input").type("kysmär")
    cy.get(":nth-child(4) > .ui > label").click()

    cy.get(":nth-child(7) > .ui").click()

    cy.contains("Courses").click()

    cy.contains("TESTcode").click()
    cy.contains("Delete course").click()

    cy.url().should("include", "/courses")

    cy.contains("TESTcode").should("not.exist")
  })
  it("Can't add course if fields are left empty.", () => {
    cy.visit("localhost:3000/")
    cy.contains("Student").click()
    cy.contains("Admin").click()
    cy.contains("Add Course").click()
    cy.get(":nth-child(7) > .ui").click()
    cy.url().should("include", "/addcourse")
  })
})
