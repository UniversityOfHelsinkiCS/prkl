/* eslint-disable cypress/no-unnecessary-waiting */
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Course registrations', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  after(() => {
    cy.switchToAdmin();
    cy.seedDatabase();
  });

  describe('Course enrolment for student', () => {
    beforeEach(() => {
      cy.switchToStudent();
    });

    it('Can enrol on a course', () => {
      const course = courses[1];
      cy.contains(courses[1].title).click();

      cy.get('[data-cy="question-0"]').click();
      const answers = [course.questions[0].questionChoices[1].content];
      cy.contains(answers[0]).click();

      cy.get('[data-cy="question-1"]').click();
      answers.push(course.questions[1].questionChoices[1].content);
      cy.get('[data-cy="question-1"]').contains(answers[1]).then((item) => {
        item.click();
      });

      answers.push('My cool answer');
      cy.get('[data-cy="question-2"]').type(answers[2]);

      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.get('[data-cy="notification"]').should('contain.text', 'Registration successful');
      cy.contains('Groups are not ready yet...');

      // Admin-role check for correct answers.
      cy.switchToAdmin();
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="show-registrations-button"]').click();
      for (const answer of answers) {
        cy.contains(answer);
      }
    });

    it('Can not enrol with answers missing', () => {
      cy.contains(courses[1].title).click();

      cy.get('[data-cy="register-on-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="confirmation-button-confirm"]').should('not.exist');

      cy.contains('Please answer all questions!');
    });

    it('Can not enrol without accepting the privacy terms', () => {
      cy.contains(courses[0].title).click();

      // Cycle the checkbox on once to account for a past validation bug.
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="confirmation-button-confirm"]').should('not.exist');

      cy.contains('Please answer all questions!');
    });

    it('Can enrol without answering optional questions', () => {
      const course = courses[11];
      cy.contains(course.title).click();
      cy.contains(course.questions[0].content);
      cy.contains(course.questions[1].content);
      cy.contains(course.questions[2].content);
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.contains('Already registered!');
    });

    it('Can not enrol twice on the same course', () => {
      cy.contains(courses[0].title).click();

      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.contains('Already registered!');
      cy.wait(500);
      cy.get('[data-cy="register-on-course-button"]').should('not.exist');
    });
  });

  describe('Canceling registration as student', () => {
    beforeEach(() => {
      cy.switchToStudent();
    });
    it('Can cancel registration before deadline, frontend', () => {
      // frontend
      cy.contains(courses[0].title).click();

      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="notification"]').should('contain.text', 'Registration successful');

      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="cancel-registration-button"]').should('exist');
      cy.get('[data-cy="cancel-registration-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="register-on-course-button"]').should('exist');

      // backend
      cy.createRegistration(0, 0).then((resp) => {
        expect(resp.status).to.eq(200);
      });

      cy.deleteRegistration(0, 0, 0).then((resp) => {
        expect(resp.status).to.eq(200);
      });
    });

    it('Can not cancel registration after deadline', () => {
      cy.deleteRegistration(0, 3, 0).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

    it('Can not cancel someone elses registration', () => {
      cy.deleteRegistration(3, 0, 0).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });
  });

  describe('Enrolment management for staff', () => {
    beforeEach(() => {
      cy.switchToStaff();
    });

    it('Can see enrolled students only on own course', () => {
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname);
      cy.contains('Students enrolled to the course:');

      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.wait(500);
      cy.get('[data-cy="show-registrations-button"]').should('not.exist');
      cy.get('[data-cy="registration-table"]').should('not.exist');
      cy.contains('Students enrolled to the course:').should('not.exist');

      // Test that restrictions apply to backend too.
      cy.courseRegistrations(0, 1).then((resp) => {
        expect(resp.status).to.eq(200);
      });
      cy.courseRegistrations(4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

    it('Can remove enrollments only from own course', () => {
      // can remove student from own course
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname).should('not.exist');

      // can't remove student from other's course
      cy.deleteRegistration(3, 4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });
  });

  describe('Enrolment management for admin', () => {
    beforeEach(() => {
      cy.switchToAdmin();
    });

    it('Admin can remove enrollments from any course', () => {
      // remove student from own course
      cy.contains(courses[4].title).click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname).should('not.exist');

      // remove student from other's course
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      // check that admin sees list of enrollments
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname);
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[3].firstname).should('not.exist');

      // remove student from course which contains questions and working times
      // gotta enroll to such course first... could make this easier
      cy.visit('/courses');
      cy.switchToStudent();
      const course = courses[1];
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="question-0"]').click();
      const answers = [course.questions[0].questionChoices[1].content];
      cy.contains(answers[0]).click();

      cy.get('[data-cy="question-1"]').click();
      answers.push(course.questions[1].questionChoices[1].content);
      cy.get('[data-cy="question-1"]').contains(answers[1]).then((item) => {
        item.click();
      });

      answers.push('My cool answer');
      cy.get('[data-cy="question-2"]').type(answers[2]);
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.switchToAdmin();
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(500);
      cy.get('[data-cy="registration-table"]').contains(users[0].firstname).should('not.exist');
    });
  });
});
