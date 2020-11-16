// / <reference types="Cypress" />
const courses = require('../../../server/data/courses');
const users = require('../../../server/data/users');

describe('Student', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStudent();
  });

  after(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  })

  describe('access', () => {
    it('Can not see staff and admin views', () => {
      cy.visit('/addcourse');
      cy.contains('You do not have the required roles');
  
      cy.visit('/usermanagement');
      cy.contains('You do not have the required roles');
    });

    it('Cannot create a course', () => {
      cy.createCourse(0, 0).then((resp) => {
        expect(resp.status).to.eq(500);
      });
    });

  });

  describe('course listing', () => {
    it('Can see the course listing', () => {
      cy.visit('/');
      cy.contains(courses[0].title);
    });
    
    it('Can not see non-valid courses', () => {
      cy.visit('/');
      cy.wait(500);
      // unpublished course
      cy.contains(courses[2].title).should('not.exist');
      // past course without registration
      cy.contains(courses[8].title).should('not.exist');
  
      // deleted course
      cy.switchToAdmin();
      cy.contains(courses[0].title).click();
      cy.get('[data-cy="delete-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
  
      cy.switchToStudent();
      cy.visit('/courses');
      cy.wait(500);
      cy.get('[data-cy="loader"]').should('not.exist');
      cy.contains(courses[0].title).should('not.exist');
    });

    it('Can see past courses if registered', () => {
      cy.visit('/');
      cy.contains(courses[3].title).should('exist');
    })

    it('Can not see staffcontrols', () => {
      cy.visit('/courses');
      cy.wait(500);
      cy.get('[data-cy="checkbox-staff-controls"]').should('not.exist');
    });
  
    it('Can see tag `enrolled` when registered on course', () => {
      cy.visit('/courses');
      cy.contains('Enrolled');
    });
  });

  describe('personal info', () => {
    it('Can see their personal info', () => {
      cy.visit('/');
      cy.contains('Personal info').click();
      cy.url().should('include', '/user');
  
      cy.contains(`Name: ${users[0].firstname} ${users[0].lastname}`);
      cy.contains(`Student number: ${users[0].studentNo}`);
      cy.contains(`Email: ${users[0].email}`);
    });

    it('Can see (only) courses they have enrolled to', () => {
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
  
      cy.visit('/user');
      cy.contains(courses[0].title);
      cy.contains(courses[1].title).should('not.exist');
    });
  });

  describe('course enrolment', () => {
    it('Can enrol on a course', () => {
      const course = courses[1];
      cy.visit('/');
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
  
      cy.get('[data-cy="registered"]').should('exist');
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
      cy.visit('/');
      cy.contains(courses[1].title).click();
  
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="confirmation-button-confirm"]').should('not.exist');

      cy.contains('Please answer all questions!');
    });
  
    it('Can not enrol without accepting the privacy terms', () => {
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      // Cycle the checkbox on once to account for a past validation bug.
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="confirmation-button-confirm"]').should('not.exist');

      cy.contains('Please answer all questions!');
    });
  
    it('Can not enrol twice on the same course', () => {
      cy.visit('/');
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

  describe('cancel registration', () => {
    it('Can cancel registration before deadline, frontend', () => {
      //frontend
      cy.visit('/');
      cy.contains(courses[0].title).click();
  
      cy.get('[data-cy="toc-checkbox"]').click();
      cy.get('[data-cy="register-on-course-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="registered"]').should('exist');

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
      })
      
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
});
