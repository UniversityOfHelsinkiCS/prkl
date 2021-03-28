const courses = require('../fixtures/courses');
const users = require('../fixtures/users');

describe('User access and content', () => {
  beforeEach(() => {
    cy.seedDatabase();
  });

  after(() => {
    cy.switchToAdmin();
    cy.seedDatabase();
  });

  it('Student', () => {
    cy.switchToStudent();
    // menu
    cy.wait(300);
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('not.exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
    cy.get('[data-cy="mockbar"]').should('exist');

    // paths
    cy.visit('/addcourse');
    cy.contains('You do not have the required roles');
    cy.visit('/usermanagement');
    cy.contains('You do not have the required roles');

    // course listing
    cy.visit('/courses');
    cy.wait(500);

    // course descriptions
    cy.get(`[data-cy="${courses[0].code}"]`).within(() => {
      cy.contains(courses[0].description);
    });

    // course teachers
    cy.get(`[data-cy="${courses[0].code}"]`).within(() => {
      cy.contains('Teachers').click();
      cy.contains(courses[0].teachers[0].firstname);
      cy.contains(courses[0].teachers[0].lastname);
      cy.contains(courses[0].teachers[0].email);
      cy.contains('Teachers').click();
    });

    // cannot see staff controls
    cy.get('[data-cy="checkbox-staff-controls"]').should('not.exist');
    // published course
    cy.contains(courses[0].title);
    // unpublished course
    cy.contains(courses[2].title).should('not.exist');
    // past course without registration
    cy.contains(courses[8].title).should('not.exist');
    // past course with registration
    cy.contains(courses[3].title).should('exist').children().get('[data-cy=tag-enrolled]');
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

    // course page
    cy.contains(courses[1].title).click();
    cy.get(`[href="https://courses.helsinki.fi/fi/${courses[1].code}"]`).should('exist');

    // personal info
    cy.get('[data-cy="menu-item-info"]').click();
    cy.url().should('include', '/user');
    cy.contains(`${users[0].firstname} ${users[0].lastname}`);
    cy.contains(`${users[0].studentNo}`);
    cy.contains(`${users[0].email}`);
    cy.contains(courses[3].title);
    cy.contains(courses[1].title).should('not.exist');
  });

  it('Staff', () => {
    cy.switchToStaff();
    // menu
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('not.exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('not.exist');
    cy.get('[data-cy="mockbar"]').should('exist');

    // course listing
    // unpublished course visible
    cy.contains(courses[2].title);
    // staff controls
    cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
    // only own courses
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    cy.wait(500);
    cy.contains(courses[1].title).should('not.exist');
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    // past courses
    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.contains(courses[8].title).should('exist');
    // toggle combo
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    cy.contains(courses[0].title).should('exist');
    cy.contains(courses[1].title).should('not.exist');
    cy.contains(courses[2].title).should('exist');
    cy.contains(courses[3].title).should('exist');
    cy.contains(courses[4].title).should('not.exist');
    cy.contains(courses[5].title).should('not.exist');
    cy.contains(courses[6].title).should('exist');
    cy.contains(courses[7].title).should('exist');
    cy.contains(courses[8].title).should('exist');
    // hide past courses again
    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.wait(500);
    cy.contains(courses[8].title).should('not.exist');
    // show only own toggle off
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    cy.contains(courses[1].title).should('exist');

    // tags in course listing
    cy.wait(500);
    cy.get('[data-cy="TC01"]').within(() => {
      cy.get('[data-cy="tag-own"]').should('exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="TC02"]').within(() => {
      cy.get('[data-cy="tag-own"]').should('not.exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="TC03"]').within(() => {
      cy.get('[data-cy="tag-own"]').should('exist');
      cy.get('[data-cy="tag-unpublished"]').should('exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.wait(500);
    cy.get('[data-cy="TC04"]').within(() => {
      cy.get('[data-cy="tag-own"]').should('exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('exist');
    });
  });

  it('Admin', () => {
    cy.wait(500);
    cy.switchToAdmin();
    // menu
    cy.get('[data-cy="menu-item-courses"]').should('exist');
    cy.get('[data-cy="menu-item-add-course"]').should('exist');
    cy.get('[data-cy="menu-item-user-mgmt"]').should('exist');
    cy.get('[data-cy="menu-item-info"]').should('exist');
    cy.get('[data-cy="menu-item-privacy-toggle"]').should('exist');
    cy.get('[data-cy="mockbar"]').should('not.exist');

    // course listing
    // unpublished course visible
    cy.contains(courses[2].title);
    // staff controls
    cy.get('[data-cy="checkbox-staff-controls"]').should('exist');
    // only own courses
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    cy.wait(500);
    cy.contains(courses[0].title).should('not.exist');
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    // past courses
    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.contains(courses[3].title).should('exist');
    // toggle combo
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();
    cy.wait(500);
    cy.contains(courses[0].title).should('not.exist');
    cy.contains(courses[1].title).should('exist');
    cy.contains(courses[2].title).should('not.exist');
    cy.contains(courses[3].title).should('not.exist');
    // turn off staff controls
    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.get('[data-cy="checkbox-staff-controls"]').last().click();

    // tags in course listing
    cy.get('[data-cy="TC01"]').within(() => {
      cy.wait(500);
      cy.get('[data-cy="tag-own"]').should('not.exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="TC02"]').within(() => {
      cy.wait(500);
      cy.get('[data-cy="tag-own"]').should('exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="TC03"]').within(() => {
      cy.wait(500);
      cy.get('[data-cy="tag-own"]').should('not.exist');
      cy.get('[data-cy="tag-unpublished"]').should('exist');
      cy.get('[data-cy="tag-dl"]').should('not.exist');
      cy.get('[data-cy="tag-enrolled"]').should('not.exist');
    });

    cy.get('[data-cy="checkbox-staff-controls"]').first().click();
    cy.get('[data-cy="TC04"]').within(() => {
      cy.wait(500);
      cy.get('[data-cy="tag-own"]').should('not.exist');
      cy.get('[data-cy="tag-unpublished"]').should('not.exist');
      cy.get('[data-cy="tag-dl"]').should('exist');
    });
  });
});
