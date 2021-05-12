import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import {
  TextField,
  CircularProgress,
  Divider,
  Paper,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import { ALL_USERS, EDIT_USER_ROLE } from '../../GqlQueries';
import { useUsersStyle } from '../../styles/users/Users';
import { useLoaderStyle } from '../../styles/ui/Loader';
import { OrangeButton } from '../../styles/ui/Button';
import roles from '../../util/userRoles';
import { AppContext } from '../../App';

export default () => {
  const classes = useUsersStyle();
  const loaderClass = useLoaderStyle();
  const [allUsers, setAllUsers] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [mocking, setMocking] = useStore('mocking');
  const [search, setSearch] = useState('');
  const [editUserRole] = useMutation(EDIT_USER_ROLE);
  const intl = useIntl();
  const history = useHistory();
  const { user } = useContext(AppContext);

  const { loading, error, data } = useQuery(ALL_USERS, {
    skip: user.role !== roles.ADMIN_ROLE,
  });

  useEffect(() => {
    if (!loading && data?.users !== undefined) {
      const usersToSet = data.users;
      setAllUsers(usersToSet);
    }
  }, [loading, data]);

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleRoleButtonClick = (id, role) => {
    const variables = { id, role };
    try {
      editUserRole({
        variables,
      }).then();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error editing role:', e);
    }
  };

  const handleLogInAs = id => {
    setMocking(prev => ({ ...prev, mockedUser: id }));
    history.push('/courses');
    window.location.reload();
  };

  if (error !== undefined) {
    // eslint-disable-next-line no-console
    console.log('error:', error);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  if (loading || !allUsers) {
    return <CircularProgress className={loaderClass.root} />;
  }

  return (
    <div>
      <TextField
        id="outlined-search"
        label={intl.formatMessage({ id: 'users.searchPlaceholder' })}
        type="search"
        variant="outlined"
        onChange={handleSearchChange}
      />
      <Divider className={classes.divider} />
      {allUsers.length === 0 ? (
        <div>
          <p />
          <Paper className={classes.emptyHeader} variant="outlined">
            <FormattedMessage id="users.empty" />
          </Paper>
        </div>
      ) : (
        <div>
          {allUsers
            .filter(
              u =>
                u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
                u.lastname?.toLowerCase().includes(search.toLowerCase()) ||
                u.studentNo?.includes(search.toLowerCase())
            )
            .map(u => (
              <Card
                variant="outlined"
                className={classes.cardRoot}
                key={u.id}
                data-cy={`manage-user-${u.shibbolethUid}`}
              >
                <CardContent>
                  <Typography variant="h5">{`${u.lastname} ${u.firstname}`}</Typography>
                  <Typography>{`${u.email} - ${u.studentNo}`}</Typography>
                  {u.role === roles.ADMIN_ROLE ? (
                    <FormattedMessage id="users.admin" />
                  ) : (
                    <div className={classes.buttonDiv}>
                      <Button
                        onClick={() => handleRoleButtonClick(u.id, roles.STAFF_ROLE)}
                        className={
                          u.role === roles.STAFF_ROLE
                            ? classes.activeRole
                            : classes.plainButtonMargin
                        }
                        data-cy={`staff-button-${u.shibbolethUid}`}
                      >
                        {intl.formatMessage({ id: 'users.staff' })}
                      </Button>
                      <Button
                        onClick={() => handleRoleButtonClick(u.id, roles.STUDENT_ROLE)}
                        className={
                          u.role === roles.STUDENT_ROLE
                            ? classes.activeRole
                            : classes.plainButtonMargin
                        }
                        data-cy={`student-button-${u.shibbolethUid}`}
                      >
                        {intl.formatMessage({ id: 'users.student' })}
                      </Button>
                      <OrangeButton
                        onClick={() => handleLogInAs(u.shibbolethUid)}
                        data-cy={`log-in-as-${u.shibbolethUid}`}
                      >
                        Log in as this user
                      </OrangeButton>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
