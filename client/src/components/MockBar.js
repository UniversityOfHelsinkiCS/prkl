import React, { useContext } from 'react';
import { useStore } from 'react-hookstore';
import { AppContext } from '../App';
import { AppBar, Button, ButtonGroup, Toolbar, Typography, Box } from '@material-ui/core';

import { useMockBarStyles } from '../styles/ui/MockBar';

export default () => {
  const [mocking, setMocking] = useStore('mocking');
  const { user } = useContext(AppContext);

  const stopMocking = async (setMocking, mockedBy) => {
    setMocking(prev => ({ ...prev, mockedUser: mockedBy }));
    window.location.reload();
  };

  
  const classes = useMockBarStyles();

  return (
    <>
      {mocking.mockedUser !== mocking.mockedBy ? (
        <AppBar className={classes.appbar} position={"static"} data-cy="mockbar">
          <Toolbar>

              <Typography className={classes.typography}>Logged in as: {user.firstname} {user.lastname}</Typography>
              
              <ButtonGroup className={classes.mockingControls}>
                <Button
                  onClick={() => stopMocking(setMocking, mocking.mockedBy)}
                  data-cy="stop-mocking-button"
                >
                  Switch back to Admin
                </Button>
              </ButtonGroup>

          </Toolbar>
        </AppBar>) : null}
    </>
  );
};
