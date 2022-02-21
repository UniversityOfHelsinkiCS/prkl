/* eslint-disable cypress/no-unnecessary-waiting */
const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('Editing an existing course', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  after(() => {
    cy.switchToAdmin();
    cy.seedDatabase();
  });

  describe('Admin', () => {
    beforeEach(() => {
      cy.switchToAdmin();
    });

    it('Can delete any course', () => {
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');

      cy.visit('/courses');
      cy.contains(courses[4].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[4].title).should('not.exist');
    });

    it('Can edit course title and description', () => {
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-title-input"]').type('{selectall}{backspace}').type('Course from Cypress Edited');
      cy.get('[data-cy="course-description-input"]').type('{selectall}{backspace}').type('New description for course');
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.visit('/courses');
      cy.contains('Course from Cypress Edited').click();
      cy.contains('New description for course');
    });

    it('Can only edit textual content of existing questions in a published course', () => {
      const course = courses[1];
      const testTitle = 'test title';
      const testChoice = 'test choice';

      cy.wait(300);
      cy.contains(course.title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
      cy.get('[data-cy="question-remove-button"]').should('not.exist');
      cy.get('[data-cy="add-question-choice-button"]').should('not.exist');
      cy.get('[data-cy="remove-question-choice-button"]').should('not.exist');

      cy.get('[data-cy="question-title"]').first().type('{selectall}{backspace}').type(testTitle);
      cy.get('[data-cy="question-1-choice-1"]').type('{selectall}{backspace}').type(testChoice);
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.contains(course.title).click();
      cy.get('[data-cy="coursepage-question"]').should('have.length', 3);
      cy.get('[data-cy="coursepage-question"]').first().contains(testTitle).should('exist');
    });

    it('Can make deadline past immediately', () => {
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-deadline-control"]').click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[0].title).should('not.exist');
    });

    it('Correct teachers are chosen in advance when course is being edited', () => {
      // staff, not admin
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname);
      cy.get('[data-cy="teacher-dropdown"]').should('not.contain', users[2].firstname);

      cy.visit('/courses');
      // not staff, admin
      cy.contains(courses[1].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname);
      cy.get('[data-cy="teacher-dropdown"]').should('not.contain', users[1].firstname);

      cy.visit('/courses');
      // both staff and admin
      cy.contains(courses[7].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname);
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname);
    });

    it('Removing all teachers from course makes admin the teacher', () => {
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="teacher-dropdown"]').find('.MuiChip-deleteIcon').click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.get('[data-cy="TC01"]').within(() => {
        cy.get('[data-cy="tag-own"]').should('exist');
      });
    });
  });

  describe('Staff', () => {
    beforeEach(() => {
      cy.switchToStaff();
    });

    it('Can delete only own, unpublished course', () => {
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.wait(500);
      cy.contains(courses[2].title).should('not.exist');

      // check that deleting other's courses won't work even from backend
      cy.deleteCourse(1, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
      cy.deleteCourse(5, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

    it('Can edit title, code, deadline and description of an unpublished course', () => {
      const newTitle = 'Title by staff member';
      const newCode = 'NewCode123';
      const newDate = '2050-04-23';
      const newDescription = 'Description by staff member';

      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-title-input"]').type('{selectall}{backspace}').type(newTitle);
      cy.get('[data-cy="course-code-input"]').type('{selectall}{backspace}').type(newCode);
      cy.get('[data-cy="course-deadline-input"]').type(newDate);
      cy.get('[data-cy="course-description-input"]').type('{selectall}{backspace}').type(newDescription);

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.contains(newTitle).click();
      cy.contains(newCode);
      // TODO: test set date too somehow, find a way to do reliably with intl
      cy.contains(newDescription);
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="publish-checkbox"]').should('not.have.class', 'checked');
    });

    it('Can not edit course after publishing it', () => {
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="publish-checkbox"]').click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.wait(500);
      cy.get('[data-cy="edit-course-button"]').should('not.exist');
    });

    it('Cannot make deadline past immediately', () => {
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="course-deadline-control"]').should('not.exist');
    });

    describe('Editing questions', () => {
      it('Can delete a course question', () => {
        const course = courses[6];

        cy.contains(course.title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        cy.get('[data-cy="question-remove-button"]').eq(1).click();
        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.contains(course.title).click();

        cy.contains(course.questions[0].content);
        cy.get(`[data-cy="question-${course.questions[0].order}"]`).click();
        course.questions[0].questionChoices.forEach((qc) => {
          cy.get(`[data-cy="question-${course.questions[0].order}-option-${qc.order}"]`).contains(qc.content);
        });

        cy.wait(500);
        cy.contains(course.questions[1].content).should('not.exist');
      });

      it('Can add a course question with choices', () => {
        const course = courses[6];
        const testQuestionTitle = 'test question';
        const testQuestionChoices = ['test choice 1', 'another test choice', 'third one'];

        cy.contains(course.title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        cy.get('[data-cy="add-question-button"]').click();
        cy.get('[data-cy="question-title"]').last().type(testQuestionTitle);
        testQuestionChoices.forEach((qc, i) => {
          cy.get('[data-cy="add-question-choice-button"]').last().click();
          cy.get(`[data-cy="question-${course.questions.length}-choice-${i}"]`).type(qc);
        });
        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.contains(course.title).click();

        cy.get('[data-cy="coursepage-question"]').should('have.length', 3);
        cy.contains(testQuestionTitle);
        cy.get(`[data-cy="question-${course.questions.length}"]`).click();
        testQuestionChoices.forEach((qc, i) => {
          cy.get(`[data-cy="question-${course.questions.length}-option-${i}"]`).contains(qc);
        });
      });

      it('Can edit existing questions', () => {
        const course = courses[6];
        const q1newTitle = 'newTitle1';
        const q2newTitle = 'otherNewTitle';
        const q1newChoices = ['choice1', 'choice2', 'choice3', 'choice4'];
        const q2newChoices = [
          course.questions[1].questionChoices[0].content,
          'newChoiceText',
          course.questions[1].questionChoices[2].content,
        ];

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
        cy.get('[data-cy="question-1-choice-1"]').type('{selectall}{backspace}').type(q2newChoices[1]);
        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.contains(course.title).click();
        cy.get('[data-cy="coursepage-question"]').should('have.length', 2);

        cy.get('[data-cy="coursepage-question"]').first().contains(q1newTitle);
        cy.get('[data-cy="question-0"]').click();
        q1newChoices.forEach((qc, i) => {
          cy.get(`[data-cy="question-0-option-${i}"]`).contains(qc);
        });

        cy.get('body').type('{esc}');

        cy.get('[data-cy="coursepage-question"]').last().contains(q2newTitle);
        cy.get('[data-cy="question-1"]').click();
        q2newChoices.forEach((qc, i) => {
          cy.get(`[data-cy="question-1-option-${i}"]`).contains(qc);
        });
      });
    });

    describe('Editing teachers', () => {
      it('Can add more teachers to own course', () => {
        cy.contains(courses[2].title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        cy.get('[data-cy="teacher-dropdown"]').click();
        cy.contains(users[2].firstname).click();
        cy.get('[data-cy="teacher-dropdown"]').click();

        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.get('[data-cy="TC03"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('exist');
        });
        cy.contains(courses[2].title).click();
        cy.get('[data-cy="edit-course-button"]').should('exist');

        cy.switchToAdmin();
        cy.visit('/courses');
        cy.get('[data-cy="TC03"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('exist');
        });
      });

      it('Can remove teachers from own course', () => {
        cy.contains(courses[7].title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        // remove admin from teachers and save changes
        cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname)
          .siblings().click();

        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.get('[data-cy="TC08"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('exist');
        });

        cy.switchToAdmin();
        cy.visit('/courses');
        cy.wait(500);
        cy.get('[data-cy="TC08"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('not.exist');
        });
      });

      it('Can change teacher of own course', () => {
        cy.contains(courses[2].title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        // admin becomes only teacher
        cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname).siblings().click();
        cy.get('[data-cy="teacher-dropdown"]').click();
        cy.contains(users[2].firstname).click();
        cy.get('[data-cy="teacher-dropdown"]').click();

        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.wait(500);
        cy.get('[data-cy="TC03"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('not.exist');
        });

        cy.switchToAdmin();
        cy.visit('/courses');
        cy.get('[data-cy="TC03"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('exist');
        });
      });

      it('Removing all teachers makes staff the teacher', () => {
        cy.contains(courses[7].title).click();
        cy.get('[data-cy="edit-course-button"]').click();

        cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname).siblings().click();
        cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname).siblings().click();

        cy.get('[data-cy="create-course-submit"]').click();
        cy.get('[data-cy="confirmation-button-confirm"]').click();

        cy.visit('/courses');
        cy.get('[data-cy="TC08"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('exist');
        });

        cy.switchToAdmin();
        cy.visit('/courses');
        cy.get('[data-cy="TC08"]').within(() => {
          cy.get('[data-cy="tag-own"]').should('not.exist');
        });
      });
    });
  });
});
