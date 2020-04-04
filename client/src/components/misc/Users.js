import React, { useState, useEffect } from 'react';
import { useStore } from 'react-hookstore';
import { Header, Loader, Card, Input, Divider, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ALL_USERS, EDIT_USER_ROLE } from '../../GqlQueries';
import roles from '../../util/user_roles';

export default () => {
  const [users, setUsers] = useState([]);
  const [user] = useStore('userStore');
  const [search, setSearch] = useState('');
  const [editUserRole] = useMutation(EDIT_USER_ROLE);

  const { loading: allUsersLoading, error: allUsersError, data: allUsersData } = useQuery(
    ALL_USERS,
    {
      skip: user.role !== roles.ADMIN_ROLE,
    }
  );

  const intl = useIntl();

  // for some reason, setUsers is being invoked with the new, updated users
  // after handleRoleButtonClick(). albeit this is the desired behaviour,
  // i, for one, don't know why or how it happens
  useEffect(() => {
    if (!allUsersLoading && allUsersData?.users !== undefined) {
      setUsers(allUsersData.users);
    }
  }, [allUsersData, allUsersLoading]);

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
                u.firstname.toLowerCase().includes(search.toLowerCase()) ||
                u.lastname.toLowerCase().includes(search.toLowerCase()) ||
                u.studentNo.toLowerCase().includes(search.toLowerCase())
            )
            .map(u => (
              <Card key={u.id} raised fluid>
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
                        >
                          {intl.formatMessage({ id: 'users.staff' })}
                        </Button>
                        <Button
                          onClick={() => handleRoleButtonClick(u.id, roles.STUDENT_ROLE)}
                          primary={u.role === roles.STUDENT_ROLE}
                        >
                          {intl.formatMessage({ id: 'users.student' })}
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
