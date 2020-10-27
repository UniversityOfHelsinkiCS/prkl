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

    it('Can see tags on course listing', () => {
        cy.visit('/courses');
        cy.get('[data-cy="TC01"]').within(() => {
          cy.get('[data-cy="tag-own"]').should("exist");
          cy.get('[data-cy="tag-unpublished"]').should("not.exist");
          cy.get('[data-cy="tag-dl"]').should("not.exist");
          cy.get('[data-cy="tag-enrolled"]').should("not.exist");
        });
        
        cy.get('[data-cy="TC02"]').within(() => {
          cy.get('[data-cy="tag-own"]').should("not.exist");
          cy.get('[data-cy="tag-unpublished"]').should("not.exist");
          cy.get('[data-cy="tag-dl"]').should("not.exist");
          cy.get('[data-cy="tag-enrolled"]').should("not.exist");
        });
        
        cy.get('[data-cy="TC03"]').within(() => {
          cy.get('[data-cy="tag-own"]').should("exist");
          cy.get('[data-cy="tag-unpublished"]').should("exist");
          cy.get('[data-cy="tag-dl"]').should("not.exist");
          cy.get('[data-cy="tag-enrolled"]').should("not.exist");
        });
        
        cy.get('[data-cy="checkbox-staff-controls"]').first().click();
        cy.get('[data-cy="TC04"]').within(() => {
          cy.get('[data-cy="tag-own"]').should("exist");
          cy.get('[data-cy="tag-unpublished"]').should("not.exist");
          cy.get('[data-cy="tag-dl"]').should("exist");
          cy.get('[data-cy="tag-enrolled"]').should("not.exist");
        });
      });

  });

  describe('create course', () => {
    it('Can create a course with no questions', () => {
      cy.get('[data-cy="menu-item-add-course"]').click();

      cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
      cy.get('[data-cy="course-code-input"]').type('CYP999');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');
      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.contains('CYP999');
      cy.contains('Course from Cypress');
    });

    it('If no teachers are chosen course is added', () => {
      cy.get('[data-cy="menu-item-add-course"]').click();
      // fill info
      cy.get('[data-cy="course-title-input"]').type('Course without teachers');
      cy.get('[data-cy="course-code-input"]').type('CWT123');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');
      // set all checkboxes to false
      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().click();

      cy.get('[data-cy="publish-checkbox"]').click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.get('[data-cy="CWT123"]').should('exist');
    });

    it('Correct teachers are added to the course', () => {
      // create course as admin
      cy.switchToAdmin();
      cy.get('[data-cy="menu-item-add-course"]').click();

      cy.get('[data-cy="course-title-input"]').type('Course with multiple teachers');
      cy.get('[data-cy="course-code-input"]').type('CWMT123');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');
      // set staff and admin as teachers
      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      //check that course is created 
      cy.visit('/courses');
      cy.contains('CWMT123 - Course with multiple teachers').click();

      cy.get('[data-cy="registration-table"]').should('exist');

      // check that registration table exists for staff (staff is a teacher on this course)
      cy.switchToStaff();
      cy.visit('/courses');
      cy.contains('CWMT123 - Course with multiple teachers').click();

      cy.get('[data-cy="registration-table"]').should('exist');
    });

    it('Correct person is toggled', () => {
      // check that when staff is creating course, staff is checked and admin unchecked
      // and vice versa when admin is the creator
      cy.get('[data-cy="menu-item-add-course"]').click();
      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().should('have.class', 'checked');
      cy.get('[data-cy="checkbox-course-teachers"]').last().should('not.have.class', 'checked');

      cy.switchToAdmin();

      cy.get('[data-cy="menu-item-add-course"]').click();
      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().should('not.have.class', 'checked');
      cy.get('[data-cy="checkbox-course-teachers"]').last().should('have.class', 'checked');
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
      cy.get('[data-cy="confirmation-button-confirm"]').click();

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
      cy.get('[data-cy="confirmation-button-confirm"]').click();

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
      cy.get('[data-cy="confirmation-button-confirm"]').click();

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
      cy.get('[data-cy="confirmation-button-confirm"]').click();

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

    it('Can add more teachers to own course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').last().click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.get('[data-cy="TC03"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("exist");
      });
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').should('exist');

      cy.switchToAdmin();
      cy.visit('/courses');
      cy.get('[data-cy="TC03"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("exist");
      });
    });

    it('Can remove teachers from own course', () => {
      cy.visit('/courses');
      cy.contains(courses[7].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').last().click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.get('[data-cy="TC08"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("exist");
      });

      cy.switchToAdmin();
      cy.visit('/courses');
      cy.get('[data-cy="TC08"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("not.exist");
      });
    });

    it('Can change teacher of own course', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="show-teacher-list-button"]').click();
      cy.get('[data-cy="checkbox-course-teachers"]').first().click();
      cy.get('[data-cy="checkbox-course-teachers"]').last().click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.get('[data-cy="TC03"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("not.exist");
      });

      cy.switchToAdmin();
      cy.visit('/courses');
      cy.get('[data-cy="TC03"]').within(() => {
        cy.get('[data-cy="tag-own"]').should("exist");
      });
    });

    it('Can not edit course after publishing it', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();

      cy.get('[data-cy="course-published-checkbox"]').click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

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
    });

    it('Cannot make deadline past immediately', () => {
      cy.visit('/courses');
      cy.contains(courses[2].title).click();
      cy.get('[data-cy="edit-course-button"]').click();
      cy.get('[data-cy="course-deadline-control"]').should('not.exist');
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
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('table').contains(users[3].firstname).should('not.exist');

      // can't remove student from other's course
      cy.deleteRegistration(3, 4, 1).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });
  });
});
