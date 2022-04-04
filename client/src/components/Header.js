import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppBar, Typography, Button, Grid, Toolbar } from '@material-ui/core';
import { useHeaderStyles } from '../styles/ui/Header';
import { privacyToggleVar } from '../apolloReactiveVariables';
import roles from '../util/userRoles';
import AppContext from '../AppContext';

export default () => {
  const intl = useIntl();
  const classes = useHeaderStyles();
  const { user } = useContext(AppContext);
  const [groupsUnsaved] = useStore('groupsUnsavedStore');

  // Logout feature. Calling Shibboleth headers from backend and redirecting there.
  const handleLogout = () => {
    if (
      groupsUnsaved &&
      // eslint-disable-next-line no-alert
      !window.confirm(intl.formatMessage({ id: 'groupsView.unsavedGroupsPrompt' }))
    ) {
      return;
    }
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/logout'
        : `${process.env.PUBLIC_URL}/logout`;

    axios.get(url).then(result => {
      localStorage.clear();
      window.location.replace(result.data);
    });
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Typography component={Link} to="/" variant="h5" className={classes.title}>
          Assembler
        </Typography>

        <Grid container>
          <Button
            component={Link}
            to="/courses"
            data-cy="menu-courses"
            className={classes.navigationButton}
          >
            <FormattedMessage id="header.courses" />
          </Button>

          {user && user.role >= roles.STAFF_ROLE ? (
            <Button
              component={Link}
              to="/addcourse"
              data-cy="menu-add-course"
              className={classes.navigationButton}
            >
              <FormattedMessage id="header.addCourse" />
            </Button>
          ) : null}

          {user && user.role === roles.ADMIN_ROLE ? (
            <Button
              component={Link}
              to="/usermanagement"
              data-cy="menu-user-mgmt"
              className={classes.navigationButton}
            >
              <FormattedMessage id="header.userManagement" />
            </Button>
          ) : null}
        </Grid>

        {/* these go to the right */}
        {user && user.role > roles.STAFF_ROLE ? (
          <Button
            component={Link}
            onClick={() => {
              privacyToggleVar(!privacyToggleVar());
            }}
            data-cy="menu-privacy-toggle"
            className={classes.navigationButton}
          >
            <FormattedMessage id="header.toggle" />
          </Button>
        ) : null}

        <Button
          component={Link}
          to="/user"
          data-cy="menu-info"
          className={classes.navigationButton}
        >
          <FormattedMessage id="header.personalInfo" />
        </Button>

        <Button
          component={Link}
          name="logout"
          onClick={handleLogout}
          data-cy="menu-logout"
          className={classes.navigationButton}
        >
          <FormattedMessage id="header.logout" />
        </Button>
      </Toolbar>
    </AppBar>
  );
};