// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');
const users = require('../../../server/data/users');

describe('Staff', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  })

  describe('course listing', () => {
    it('Can see an unpublished course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title);
    });

    it('Can see staffcontrols', () => {
      cy.visit('/courses');
      cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
      // only own courses
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[1].title).should('not.exist');
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      // past courses
      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('exist');
      // toggle combo
      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[0].title).should('exist');
      cy.contains(courses[1].title).should('not.exist');
      cy.contains(courses[2].title).should('exist');
      cy.contains(courses[3].title).should('exist');

      cy.get('[data-cy="checkbox-staff-controls"]').first().click();
      cy.contains(courses[3].title).should('not.exist');

      cy.get('[data-cy="checkbox-staff-controls"]').last().click();
      cy.contains(courses[1].title).should('exist');
    });

  });

  describe('create course', () => {
    it('Can create a course with no questions', () => {
      cy.get('[data-cy="menu-item-add-course"]').click();

      cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
      cy.get('[data-cy="course-code-input"]').type('CYP999');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');

      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains('CYP999');
      cy.contains('Course from Cypress');
    });
  });

  describe('editing existing course', () => {
    it('Can edit title, code, deadline and description of an unpublished course', () => {
      const newTitle = 'Title by staff member';
      const newCode = 'NewCode123';
      const newDate = '2050-04-23';
      const newDescription = 'Description by staff member';

      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-title-input"]').type('{selectall}{backspace}').type(newTitle);
      cy.get('[data-cy="course-code-input"]').type('{selectall}{backspace}').type(newCode);
      cy.get('[data-cy="course-deadline-input"]').type(newDate);
      cy.get('[data-cy="course-description-input"]').type('{selectall}{backspace}').type(newDescription);

      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(newTitle).click();
      cy.contains(newCode);
      // TODO: test set date too somehow, find a way to do reliably with intl
      cy.contains(newDescription);
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-published-checkbox"]').should('not.have.class', 'checked');
    })

    it('Can delete a course question', () => {
      const course = courses[6];

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="question-remove-button"]').eq(1).click();
      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.contains(course.questions[0].content).should('exist');
      course.questions[0].questionChoices.forEach(qc => {
        cy.get(`[data-cy="question-${course.questions[0].order}"]`).contains(qc.content).should('exist')
      });

      cy.contains(course.questions[1].content).should('not.exist');
    });

    it('Can add a course question with choices', () => {
      const course = courses[6];
      const testQuestionTitle = 'test question';
      const testQuestionChoices = ['test choice 1', "another test choice", "third one"];

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="add-question-button"]').click();
      cy.get('[data-cy="question-title"]').last().type(testQuestionTitle);
      testQuestionChoices.forEach((qc, i) => {
        cy.get('[data-cy="add-question-choice-button"]').last().click();
        cy.get(`[data-cy="question-${course.questions.length}-choice-${i}"]`).type(qc);
      });
      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="coursepage-question"]').should('have.length', 3);
      cy.contains(testQuestionTitle).should('exist');
      testQuestionChoices.forEach((qc, i) => {
        cy.get(`[data-cy="question-${course.questions.length}"]`).contains(qc).should('exist');
      });
    });

    it('Can edit existing questions', () => {
      const course = courses[6];
      const q1newTitle = "newTitle1";
      const q2newTitle = "otherNewTitle";
      const q1newChoices = ["choice1", "choice2", "choice3", "choice4"];
      const q2newChoices = [
        course.questions[1].questionChoices[0].content,
        'newChoiceText',
        course.questions[1].questionChoices[2].content
      ]

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="question-title"]').first().type('{selectall}{backspace}').type(q1newTitle);
      cy.get('[data-cy="question-title"]').last().type('{selectall}{backspace}').type(q2newTitle);
      cy.get('[data-cy="question-type-multi"]').first().click();
      cy.get('[data-cy="add-question-choice-button"]').first().click();
      cy.get('[data-cy="add-question-choice-button"]').first().click();
      q1newChoices.forEach((qc, i) => {
        cy.get(`[data-cy="question-0-choice-${i}"]`).type('{selectall}{backspace}').type(qc);
      });
      cy.get(`[data-cy="question-1-choice-1"]`).type('{selectall}{backspace}').type(q2newChoices[1]);
      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="coursepage-question"]').should('have.length', 2);
      cy.get('[aria-multiselectable="true"]').should('have.length', 2);
      cy.get('[data-cy="coursepage-question"]').first().contains(q1newTitle).should('exist');
      q1newChoices.forEach((qc) => {
        cy.get(`[data-cy="question-0"]`).contains(qc).should('exist');
      });
      cy.get('[data-cy="coursepage-question"]').last().contains(q2newTitle).should('exist');
      q2newChoices.forEach((qc) => {
        cy.get(`[data-cy="question-1"]`).contains(qc).should('exist');
      });
    });

    it('Can not edit course after publishing it', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-published-checkbox"]').click();
      cy.get('[data-cy="create-course-submit"]').click();

      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.contains('[data-cy="edit-course-button"]').should('not.exist');
    });

    it('Can delete only own, unpublished course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.visit('/courses');
      cy.contains(courses[2].title).should('not.exist');

      // check that deleting other's courses won't work even from backend
      cy.deleteCourse(1, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
      cy.deleteCourse(5, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    })
  });

  describe('enroll management', () => {
    it('Can see enrolled students only on own course', () => {
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('table').contains(users[3].firstname);
      cy.contains("Students enrolled to the course:");

      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('table').should('not.exist');
      cy.contains("Students enrolled to the course:").should('not.exist');

      // Test that restrictions apply to backend too.
      cy.courseRegistration(4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

    it('Can remove enrollments only from own course', () => {
      // remove student from own course
      cy.visit('/courses');
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="remove-registration-button"]').first().click();
      cy.get('table').contains(users[3].firstname).should('not.exist');

      // can't remove student from other's course
      cy.deleteRegistration(3, 4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });
  });
});
