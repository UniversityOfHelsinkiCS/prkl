import React, { useState } from 'react';
import { useStore } from 'react-hookstore';
import { Header, Loader, Card, Input, Divider, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { EDIT_USER_ROLE } from '../../GqlQueries';
import roles from '../../util/userRoles';

export default ({ allUsersError, allUsersLoading }) => {
	const [users] = useStore('allUsersStore');
	const [mocking, setMocking] = useStore('mocking');
  const [search, setSearch] = useState('');
  const [editUserRole] = useMutation(EDIT_USER_ROLE);
	const intl = useIntl();
	const history = useHistory();

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleRoleButtonClick = (id, role) => {
    const variables = { id, role };
    try {
      editUserRole({
        variables,
      });
    } catch (e) {
      console.log('error editing role:', e);
    }
  };

	const handleLogInAs = (setMocking, id) => {
		setMocking(prev => ({ ...prev, mockedUser: id }));
		history.push('/courses');
		// Do we want to reload page here?
	}

  if (allUsersError !== undefined) {
    console.log('error:', allUsersError);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  if (allUsersLoading || !users) {
    return <Loader active />;
  }

  return (
    <div>
      <Input
        onChange={handleSearchChange}
        placeholder={intl.formatMessage({ id: 'users.searchPlaceholder' })}
      />
      <Divider />
      {users.length === 0 ? (
        <div>
          <p />
          <Header as="h3" block>
            <FormattedMessage id="users.empty" />
          </Header>
        </div>
      ) : (
        <div>
          {users
            .filter(
              u =>
                u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
                u.lastname?.toLowerCase().includes(search.toLowerCase()) ||
                u.studentNo?.includes(search.toLowerCase())
            )
            .map(u => (
              <Card key={u.id} raised fluid data-cy={`manage-user-${u.shibbolethUid}`}>
                <Card.Content>
                  <Card.Header content={`${u.lastname} ${u.firstname}`} />
                  <Card.Description content={`${u.email} - ${u.studentNo}`} />
                  <Card.Content>
                    {u.role === roles.ADMIN_ROLE ? (
                      <FormattedMessage id="users.admin" />
                    ) : (
                      <div>
                        <Button
                          onClick={() => handleRoleButtonClick(u.id, roles.STAFF_ROLE)}
                          primary={u.role === roles.STAFF_ROLE}
                          data-cy={`staff-button-${u.shibbolethUid}`}
                        >
                          {intl.formatMessage({ id: 'users.staff' })}
                        </Button>
                        <Button
                          onClick={() => handleRoleButtonClick(u.id, roles.STUDENT_ROLE)}
                          primary={u.role === roles.STUDENT_ROLE}
                          data-cy={`student-button-${u.shibbolethUid}`}
                        >
                          {intl.formatMessage({ id: 'users.student' })}
                        </Button>
												<Button
													onClick={() => handleLogInAs(setMocking, u.shibbolethUid)}
													color="orange"
													data-cy={`log-in-as-${u.shibbolethUid}`}
												>
													Log in as this user
												</Button>	
											</div>
                    )}
                  </Card.Content>
                </Card.Content>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
