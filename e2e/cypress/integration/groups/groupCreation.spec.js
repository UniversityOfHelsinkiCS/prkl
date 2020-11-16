const courses = require('../../../../server/data/courses');
const users = require('../../../../server/data/users');

describe('Group creation', () => {
  beforeEach(() => {
    cy.seedDatabase();
    cy.switchToStaff();
  });

  describe('teacher', () => {
    const course = courses[3];

    it('Can create and save groups', () => {
      // Do not save first on purpose
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      // Reload to check that no info was stored
      cy.reload();
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('table').should('not.exist');
      cy.contains('No groups generated');

      // Generate groups and save them
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      // Reload to be sure that information is stored at backend
      cy.reload();
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('table').contains(users[0].firstname);
      cy.get('table').contains(users[3].firstname);
      cy.contains('No groups generated').should('not.exist');
    });

    it('Can drag a student from group to another', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      const dataTransfer = new DataTransfer;
      cy.get('table').contains(users[3].firstname).trigger('dragstart', { dataTransfer });
      cy.get('table').contains(users[0].firstname).trigger('drop', { dataTransfer });
      cy.get('table').contains(users[3].firstname).trigger('dragend');
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      //cy.contains('Group2').should('not.exist'); Fix this
    })

    it('Can edit existing groups', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(500);
      cy.get('[data-cy="save-groups-button"]').should('not.exist');

      // Re-generate groups, would be nice also to be able to drag'n drop...
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="save-groups-button"]').should('exist');
    });

    // No need to test publish feature here, it's done in student tests.

  });

})