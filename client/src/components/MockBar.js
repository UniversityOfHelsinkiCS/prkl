import React, { useContext } from 'react';
import { useStore } from 'react-hookstore';
import { AppBar, Button, ButtonGroup, Toolbar, Typography } from '@material-ui/core';
import { useMockBarStyles } from '../styles/ui/MockBar';
import { AppContext } from '../App';

export default () => {
  const { user } = useContext(AppContext);
  const [mocking, setMocking] = useStore('mocking');

  const stopMocking = async mockedBy => {
    setMocking(prev => ({ ...prev, mockedUser: mockedBy }));
    window.location.reload();
  };

  const classes = useMockBarStyles();

  return (
    <>
      {mocking.mockedUser !== mocking.mockedBy ? (
        <AppBar className={classes.appbar} position="static" data-cy="mockbar">
          <Toolbar>
            <Typography className={classes.typography}>
              Logged in as:
              {user.firstname}
              {user.lastname}
            </Typography>
            <ButtonGroup className={classes.mockingControls}>
              <Button onClick={() => stopMocking(mocking.mockedBy)} data-cy="stop-mocking-button">
                Switch back to Admin
              </Button>
            </ButtonGroup>
          </Toolbar>
        </AppBar>
      ) : null}
    </>
  );
};
