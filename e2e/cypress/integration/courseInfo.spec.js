const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Course information', () => {
    beforeEach(() => {
      cy.seedDatabase();
      cy.switchToAdmin();
    });
  
    after(() => {
      cy.switchToAdmin();
      cy.seedDatabase();
    });

    describe('Course information for student', () => {
        beforeEach(() => {
          cy.switchToStudent();
        });

        it('Enrollments visible for student', () => {
            cy.contains(courses[9].title).click();
            cy.contains(`Enrolled students: ${courses[9].registrations.length}`);
            cy.contains('Courses').click();
            cy.contains(courses[4].title).click();
            cy.contains(`Enrolled students: ${courses[4].registrations.length}`);
        });
    });

});