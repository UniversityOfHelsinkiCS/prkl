/* eslint-disable cypress/no-unnecessary-waiting */
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
      // Refresh to check that no info was stored
      cy.reload();
      cy.get('[data-cy="generated-groups"]').should('not.exist');
      cy.contains('No groups generated');

      // Generate groups and save them
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // Refresh to be sure that information is stored at backend
      cy.reload();
      cy.get('table').contains(users[0].firstname);
      cy.get('table').contains(users[3].firstname);
      cy.contains('No groups generated').should('not.exist');
    });

    it('Teacher can name a group', () => {
      const namedGroup = 'MyGroup';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="target-group-size"]').type('{selectAll}$9');
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${namedGroup}`);
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(namedGroup).should('exist');
    });

    it('Can drag a student from group to another', () => {
      const emptyGroup = 'Emptygroup';
      const groupToDrag = 'GroupToDrag';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(users[3].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${emptyGroup}`);

      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToDrag}`);

      const dataTransfer = new DataTransfer;
      cy.get('table').contains(users[3].firstname).trigger('dragstart', { dataTransfer });
      cy.get('table').contains(users[0].firstname).trigger('drop', { dataTransfer });
      cy.get('table').contains(users[3].firstname).trigger('dragend');
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(emptyGroup).parents('[data-cy="group-container"]').within(() => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').should('exist');
      });

      cy.contains(groupToDrag).parents('[data-cy="group-container"]').within(() => {
        cy.get('tr').should('have.length', 3);
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
      });
    });

    it('Can move a student to another group using dropdown', () => {
      const groupToMoveFrom = 'GroupToMoveFrom';
      const groupToMoveTo = 'GroupToMoveTo';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(users[3].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToMoveFrom}`);

      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToMoveTo}`);

      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(1000);

      cy.contains(groupToMoveFrom).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="switch-group-button"]').click();
      });

      cy.get('[data-cy="switch-group-select"]')
        .click()
        .contains(groupToMoveTo)
        .click();

      cy.contains(groupToMoveFrom).parents('[data-cy="group-container"]').within(() => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').should('exist');
      });

      cy.contains(groupToMoveTo).parents('[data-cy="group-container"]').within(() => {
        cy.get('tr').should('have.length', 3);
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
      });
    });

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
      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="group-remove-button"]').should('not.exist');
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${newGroupName}`);

      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.get('[data-cy="publish-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(newGroupName).should('exist');

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();

      cy.get('[data-cy="show-registrations-button"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="student-registration-row"]').within(() => {
        cy.get('[data-cy="remove-registration-button"]').click();
      });
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains('Testgroup').should('exist');
      cy.contains(users[0].firstname).should('not.exist');
      cy.contains(newGroupName).parents('[data-cy="group-container"]').within(() => {
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
      cy.contains(users[0].firstname).parents('[data-cy="group-container"]').within(() => {
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupForDelete}`);

      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(groupForDelete).should('exist');

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();

      cy.get('[data-cy="show-registrations-button"]').click();
      cy.contains(users[0].firstname).parents('[data-cy="student-registration-row"]').within(() => {
        cy.get('[data-cy="remove-registration-button"]').click();
      });
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains(groupForDelete).should('exist');
      cy.contains(users[0].firstname).should('not.exist');
      cy.contains(groupForDelete).parents('[data-cy="group-container"]').within(() => {
        cy.get('tr').should('have.length', 1);
        cy.get('[data-cy="group-remove-button"]').click();
      });
      cy.contains(groupForDelete).should('not.exist');
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.get('[data-cy="back-to-info-from-groups-button"]').click();

      cy.get('[data-cy="manage-groups-button"]').click();
      cy.wait(300);
      cy.contains(groupForDelete).should('not.exist');
    });

    it('Groupless students section contains all students before groups are generated', () => {
      cy.visit(`/course/${course.id}`);
      cy.wait(500);
      cy.get('[data-cy="manage-groups-button"]').click();

      cy.get('[data-cy="groupless-container"]').within(() => {
        cy.get('tr').should('have.length', users.length + 1);
        for (let i = 0; i < users.length; i++) {
          cy.contains(users[i].firstname);
        }
      });
    });

    it('Groupless students section is empty after generating new groups', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(300);

      cy.get('[data-cy="groupless-container"]').should('not.exist');
    });

    it('Students removed from groups are shown in groupless students', () => {
      const groupToRemoveFrom = 'Remove';
      const user = users[0];

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(user.firstname).parents('[data-cy="group-container"]').within(() => {
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${groupToRemoveFrom}`);

      cy.contains(user.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.contains(groupToRemoveFrom)
        .parents('[data-cy="group-container"]')
        .should('not.contain', user.firstname);

      cy.get('[data-cy="groupless-container"]').contains(user.firstname);
    });

    it('Groupless students are updated when canceling changes', () => {
      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      // generate new groups
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // remove student from group
      cy.contains(users[0].firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      // click cancel
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check that groupless contains all students
      cy.get('[data-cy="groupless-container"]').within(() => {
        cy.get('tr').should('have.length', users.length + 1);
        for (let i = 0; i < users.length; i++) {
          cy.contains(users[i].firstname);
        }
      });

      // generate new groups
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // save
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(300);

      // remove student
      cy.contains(users[0].firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      // cancel
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check that groupless is empty
      cy.get('[data-cy="groupless-container"]').should('not.exist');
    });

    it('Can use find group button to find group for a groupless student', () => {
      const course9 = courses[9];
      const user = users[0];

      cy.visit(`/course/${course9.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // remove user from group
      cy.contains(user.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.get('[data-cy="max-group-size"]').within(() => {
        cy.get('input').clear();
        cy.get('input').type('10');
      });

      // click find group
      cy.contains(user.firstname).parents('tr').within(() => {
        cy.get('[data-cy="find-group-button"]').click();
      });

      // check that removed from groupless
      cy.get('[data-cy="groupless-container"]').should('not.exist');

      // check that added to a group
      cy.contains(user.firstname)
        .parents('[data-cy="group-container"]');
    });

    it('Can use find group for all groupless students', () => {
      const course9 = courses[9];
      const user0 = users[0];
      const user2 = users[2];

      cy.visit(`/course/${course9.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      cy.contains(user0.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.contains(user2.firstname).parents('[data-cy="draggable-row"]').within(() => {
        cy.get('[data-cy="remove-from-group-button"]').click();
      });

      cy.get('[data-cy="max-group-size"]').within(() => {
        cy.get('input').clear();
        cy.get('input').type('10');
      });

      cy.get('[data-cy="find-group-for-all-button"]').click();

      cy.wait(500);

      cy.get('[data-cy="groupless-container"]').should('not.exist');

      cy.contains(user0.firstname)
        .parents('[data-cy="group-container"]');

      cy.contains(user2.firstname)
        .parents('[data-cy="group-container"]');
    });

    it('Can lock groups and create new groups from the others', () => {
      const course9 = courses[9];
      let user1 = '';
      let user2 = '';

      cy.visit(`/course/${course9.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      cy.get('[data-cy="target-group-size"]').within(() => {
        cy.get('input').clear();
        cy.get('input').type('2');
      });

      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(250);

      cy.get('[data-cy="lockGroupsCheckBox"]').first().click();

      cy.get('[data-cy="draggable-row"]').siblings().first().find('td').first().invoke('text').then((text) => {
        user1 = text;
      });

      cy.get('[data-cy="draggable-row"]').siblings().first().next().find('td').first().invoke('text').then((text) => {
        user2 = text;
      });

      cy.get('[data-cy="target-group-size"]').within(() => {
        cy.get('input').clear();
        cy.get('input').type('1');
      });

      cy.get('[data-cy="lockedGroups-create-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(250);

      cy.get('[data-cy="draggable-row"]').siblings().first().find('td').first().invoke('text').then((text) => {
        expect(user1).to.eq(text);
      });

      cy.get('[data-cy="draggable-row"]').siblings().first().next().find('td').first().invoke('text').then((text) => {
        expect(user2).to.eq(text);
      });
    });

    it('Locked groups retain their names', () => {
      const user = users[0];
      const lockedGroup = 'lockedGroup';

      cy.visit(`/course/${course.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // name and lock a group
      cy.contains(user.firstname).parents('[data-cy="group-container"]').within(() => {
        cy.contains(/^Group \d+$/).click(); // Regex pattern dependent on language, fix
      });
      cy.get('[data-cy="group-name-input"]').type(`{selectAll}${lockedGroup}`);
      cy.get('[data-cy="save-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();
      cy.wait(300);
      cy.contains(lockedGroup).parents('[data-cy="group-container"]').within(() => {
        cy.get('[data-cy="lockGroupsCheckBox"]').click();
      });

      // generate new groups from non-locked
      cy.get('[data-cy="lockedGroups-create-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check locked group didn't change
      cy.contains(lockedGroup).parents('[data-cy="group-container"]').within(() => {
        cy.contains(user.firstname);
        cy.get('tr').should('have.length', 2);
      });
    });

    it('Can generate groups of different sizes', () => {
      const testCourse = courses[10];
      cy.visit(`/course/${testCourse.id}`);
      cy.get('[data-cy="manage-groups-button"]').click();

      // group size 1
      // change target group size and create groups
      cy.get('[data-cy="target-group-size"]').type('{selectAll}$1');
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check groupless is empty
      cy.get('[data-cy="groupless-container"]').should('not.exist');

      // cancel groups
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();


      // group size 2
      // change target group size and create groups
      cy.get('[data-cy="target-group-size"]').type('{selectAll}$2');
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check groupless is empty
      cy.get('[data-cy="groupless-container"]').should('not.exist');

      // cancel groups
      cy.get('[data-cy="cancel-groups-button"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();


      // group size equal to registration count
      // change target group size and create groups
      cy.get('[data-cy="target-group-size"]').type(`{selectAll}$${testCourse.registrations.length}`);
      cy.get('[data-cy="create-groups-submit"]').click();
      cy.get('[data-cy="confirmation-button-confirm"]').click();

      // check groupless is empty
      cy.get('[data-cy="groupless-container"]').should('not.exist');
    });

    // No need to test publish feature here, it's done in student tests.
  });
});
