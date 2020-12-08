const courses = require('../../fixtures/courses');
const users = require('../../fixtures/users');

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
    it('Teacher can name a group', () => {
      const namedGroup = 'MyGroup';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="target-group-size"]').type('9');
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(gc =>{
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${namedGroup}`);
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(namedGroup).should('exist');

    })
    it('Can drag a student from group to another', () => {
      const emptyGroup = 'Emptygroup';
      const groupToDrag = 'GroupToDrag';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(users[3].firstname).parents('[data-cy="group-container"]').within(gc =>{
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${emptyGroup}`);

      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(gc =>{
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToDrag}`);
      
      const dataTransfer = new DataTransfer;
      cy.get('table').contains(users[3].firstname).trigger('dragstart', { dataTransfer });
      cy.get('table').contains(users[0].firstname).trigger('drop', { dataTransfer });
      cy.get('table').contains(users[3].firstname).trigger('dragend');
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(emptyGroup).parents('[data-cy="group-container"]').within(gc => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').should('exist');
      });

      cy.contains(groupToDrag).parents('[data-cy="group-container"]').within(gc => {
        cy.get('tr').should('have.length', 3);
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
      });
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

    it('When removing enrollment, group that is left empty will be retained and has a remove button', () => {
      const newGroupName = 'Testgroup123';
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(gc =>{
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${newGroupName}`);
      
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="publish-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(newGroupName).should('exist');

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();
      
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="student-registration-row"]').within(()=> {
        cy.get('[data-cy="remove-registration-button"]').click();
      });
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      
      cy.reload();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains('Testgroup').should('exist');
      cy.contains(users[0].firstname).should('not.exist');
      cy.contains(newGroupName).parents('[data-cy="group-container"]').within(gc => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').should('exist');
      });
    });

    it('When group is left empty, it can be deleted permanently', () => {
      const groupForDelete = 'DeleteThis';
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(gc =>{
        cy.contains(/^Group \d$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupForDelete}`);
      
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(groupForDelete).should('exist');

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();
      
      cy.get('[data-cy="show-registrations-button"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="student-registration-row"]').within(()=> {
        cy.get('[data-cy="remove-registration-button"]').click();
      });
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      
      cy.reload();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains(groupForDelete).should('exist');
      cy.contains(users[0].firstname).should('not.exist');
      cy.contains(groupForDelete).parents('[data-cy="group-container"]').within(gc => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').click();
      });
      cy.contains(groupForDelete).should('not.exist');
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.reload();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains(groupForDelete).should('not.exist');
    });


    // No need to test publish feature here, it's done in student tests.

  });

})