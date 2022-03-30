const users = require('../fixtures/users');

describe('Adding a new course', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToAdmin();
  });

  it('Straight to backend', () => {
    // Student cannot create a course
    cy.createCourse(0, 0).then((resp) => {
      expect(resp.status).to.eq(500);
    });
    // Staff can
    cy.createCourse(0, 1).then((resp) => {
      expect(resp.status).to.eq(200);
    });
    // Admin can
    cy.createCourse(0, 2).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  it('Can add course with timetable', () => {
    // when staff is creating course, staff is preselected and admin is not
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
    cy.get('[data-cy="course-description-input"]').type('Description for test course.');

    cy.get('[data-cy="calendar-checkbox"]').click();
    cy.get('[data-cy="create-course-submit"]').click();
    cy.get('[data-cy="confirmation-button-confirm"]').click();
    cy.get('[data-cy="CYP999"]').first().click();

    cy.get('[data-cy="time-table"]').should('exist')
  });

  it('Can change minimum working hours', () => {
    const minHour = 5
    // when staff is creating course, staff is preselected and admin is not
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
    cy.get('[data-cy="course-description-input"]').type('Description for test course.');

    cy.get('[data-cy="calendar-checkbox"]').click();
    cy.get('[data-cy="min-hour-field"]').clear()
    cy.get('[data-cy="min-hour-field"]').type(5);
    cy.get('[data-cy="create-course-submit"]').click();
    cy.get('[data-cy="confirmation-button-confirm"]').click();
    cy.get('[data-cy="CYP999"]').first().click();


    cy.get('[data-cy="time-table-minhours"]').should('contain', `Choose at least (${minHour}) hours`)
  });

  it('Can choose weekends to timetable', () => {
    // when staff is creating course, staff is preselected and admin is not
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
    cy.get('[data-cy="course-code-input"]').type('CYP999');
    cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
    cy.get('[data-cy="course-description-input"]').type('Description for test course.');

    cy.get('[data-cy="calendar-checkbox"]').click();
    cy.get('[data-cy="weekend-checkbox"]').click()
    cy.get('[data-cy="create-course-submit"]').click();
    cy.get('[data-cy="confirmation-button-confirm"]').click();
    cy.get('[data-cy="CYP999"]').first().click();

    cy.get('[data-cy="time-table"]').should('contain', `Sat`)
  });

  it('Correct person is preselected as teacher', () => {
    // when staff is creating course, staff is preselected and admin is not
    cy.switchToStaff();
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname);
    cy.get('[data-cy="teacher-dropdown"]').should('not.contain', users[2].firstname);

    // and vice versa when admin is the creator
    cy.switchToAdmin();
    cy.get('[data-cy="menu-add-course"]').click();
    cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname);
    cy.get('[data-cy="teacher-dropdown"]').should('not.contain', users[1].firstname);
  });

  describe('Staff adding a new course', () => {
    beforeEach(() => {
      cy.switchToStaff();
    });

    it('Can create a course with no questions', () => {
      cy.get('[data-cy="menu-add-course"]').click();

      cy.get('[data-cy="course-title-input"]').type('Course from Cypress');
      cy.get('[data-cy="course-code-input"]').type('CYP999');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');
      cy.get('[data-cy="teacher-dropdown"]').click();
      cy.contains(users[1].firstname).click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.visit('/courses');
      cy.contains('CYP999');
      cy.contains('Course from Cypress');
    });

    it('If no teachers are chosen course is added and staff is teacher', () => {
      cy.get('[data-cy="menu-add-course"]').click();
      // fill info
      cy.get('[data-cy="course-title-input"]').type('Course without teachers');
      cy.get('[data-cy="course-code-input"]').type('CWT123');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');

      // delete pre selected teacher (staff)
      cy.get('[data-cy="teacher-dropdown"]').contains(users[1].firstname).siblings().click();

      cy.get('[data-cy="publish-checkbox"]').click();
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      // check that course has been created and staff added as teacher
      cy.visit('/courses');
      cy.get('[data-cy="CWT123"]').should('exist');
      cy.get('[data-cy="CWT123"]').within(() => {
        cy.get('[data-cy="tag-own"]').should('exist');
      });
    });

    it('Correct teachers are added to the course', () => {
      // create course as admin
      cy.switchToAdmin();
      cy.get('[data-cy="menu-add-course"]').click();
      cy.get('[data-cy="course-title-input"]').type('Course with multiple teachers');
      cy.get('[data-cy="course-code-input"]').type('CWMT123');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');

      // admin should be pre selected
      cy.get('[data-cy="teacher-dropdown"]').contains(users[2].firstname);

      // add staff as teacher
      cy.get('[data-cy="teacher-dropdown"]').click();
      cy.contains(users[1].firstname).click();
      cy.get('[data-cy="teacher-dropdown"]').click();

      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check that course is created
      cy.visit('/courses');
      cy.wait(500);
      cy.get('[data-cy="CWMT123"]').within(() => {
        cy.get('[data-cy="tag-own"]').should('exist');
      });
      cy.contains('CWMT123 - Course with multiple teachers').click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="registration-table"]').should('exist');

      // check that staff is also a teacher of this course
      cy.switchToStaff();
      cy.visit('/courses');
      cy.get('[data-cy="CWMT123"]').within(() => {
        cy.get('[data-cy="tag-own"]').should('exist');
      });
      cy.contains('CWMT123 - Course with multiple teachers').click();
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.get('[data-cy="registration-table"]').should('exist');
    });

    it('Can make questions optional', () => {
      cy.get('[data-cy="menu-add-course"]').click();

      // input course details
      cy.get('[data-cy="course-title-input"]').type('OptionalQuestionsTest');
      cy.get('[data-cy="course-code-input"]').type('123');
      cy.get('[data-cy="course-deadline-input"]').type('2100-12-12');
      cy.get('[data-cy="course-description-input"]').type('Description for test course.');

      // add optional freeform question
      cy.get('[data-cy="add-question-button"]').click();
      cy.get('[data-cy="question-title"]').type('Optional freeform');
      cy.get('[data-cy="question-type-freeform"]').click();
      cy.get('[data-cy="question-optionality-checkbox"]').click();

      // add required freeform question
      cy.get('[data-cy="add-question-button"]').click();
      cy.get('[data-cy="question-title"]').last().type('Required freeform');
      cy.get('[data-cy="question-type-freeform"]').last().click();

      // confirm
      cy.get('[data-cy="create-course-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="123"]').first().click();


      // check that questions are marked correctly on course page
      cy.contains('Optional freeform')
        .parents('[data-cy="coursepage-question"]')
        .should('not.contain', '*');

      cy.contains('Required freeform')
        .parents('[data-cy="coursepage-question"]')
        .should('contain', '*');
    });
  });
});
