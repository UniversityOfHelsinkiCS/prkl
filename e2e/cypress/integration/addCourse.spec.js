const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Adding a new course', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
    cy.visit('/');
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  })

  it('Student cannot create a course', () => {
    cy.switchToStudent();
    cy.createCourse(0, 0).then((resp) => {
      expect(resp.status).to.eq(500);
    });
  });
});
