describe("first prkl test", () => {
    it("fills out course form, posts it, lists courses, removes course it added", () => {
        //to run the tests, you need to compose via docker, start the client in 
        //dev mode and start up cypress.
        cy.visit("localhost:3000/")

        cy.contains("Courses").click()

        cy.contains("Add Course").click()

        cy.get(':nth-child(1) > .field > .ui > input').type("super unique cypress test course title")
        cy.get(':nth-child(2) > :nth-child(1) > .ui > input').type("TESTcode")
        cy.get(':nth-child(2) > :nth-child(2) > .ui > input').type("3000-01-01")

        cy.get('textarea').type("epic description")

        cy.get(':nth-child(4) > :nth-child(1) > .ui > input').type(2)
        cy.get(':nth-child(4) > :nth-child(2) > .ui > input').type(3)

        cy.get(':nth-child(5) > :nth-child(1) > .ui').click()

        cy.get('[style="flex-wrap: wrap;"] > :nth-child(1) > .ui > input').type("question 1")
        cy.get('[style="flex-wrap: wrap;"] > :nth-child(2) > .ui > input').type("question 2")

        cy.get(':nth-child(7) > .ui').click()

        cy.contains("TESTcode").click()
        cy.contains("Delete course").click()

        cy.url().should("include", "/courses")

    })
})