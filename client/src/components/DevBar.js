import React, { useContext } from 'react';
import axios from 'axios';
import { useStore } from 'react-hookstore';
import { AppContext } from '../App';

import { AppBar, Button, ButtonGroup, Toolbar, Typography, Box } from '@material-ui/core';
import { useDevBarStyles } from '../styles/ui/DevBar';

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.PUBLIC_URL;

const switchUser = async (setMocking, id) => {
  setMocking(prev => ({ ...prev, mockedUser: id }));
  window.location.reload();
};

const stopMocking = async (setMocking, mockedBy) => {
  setMocking(prev => ({ ...prev, mockedUser: mockedBy }));
  window.location.reload();
};

const resetDatabase = async () => {
  await axios.get(`${apiUrl}/reset`);
  window.location.reload();
};

const seedDatabase = async () => {
  await axios.get(`${apiUrl}/seed`);
  window.location.reload();
};

const seedDemoDatabase = async () => {
  await axios.get(`${apiUrl}/demoseed`);
  window.location.reload();
};

export default () => {
  const [mocking, setMocking] = useStore('mocking');
  const { user } = useContext(AppContext);

  const classes = useDevBarStyles();

  return (
    <AppBar className={classes.appbar} position={"static"}>
      <Toolbar>

        <Typography variant="h5" className={classes.title}>Devbar</Typography>

        <Box>
          <Typography>Log in as...</Typography>

          <ButtonGroup className={classes.roleControls}>
            <Button onClick={() => switchUser(setMocking, 1)} data-cy="switch-to-student">
              Student
            </Button>
            <Button onClick={() => switchUser(setMocking, 2)} data-cy="switch-to-staff">
              Staff
            </Button>
            <Button onClick={() => switchUser(setMocking, mocking.mockedBy)} data-cy="switch-to-admin">
              Admin
            </Button>
          </ButtonGroup>
        </Box>

        <Box>
          <Typography>Database options</Typography>

          <ButtonGroup className={classes.dbControls}>
            <Button onClick={resetDatabase}>Empty DB</Button>
            <Button onClick={seedDatabase}>Seed DB</Button>
            <Button onClick={seedDemoDatabase}>Demo DB</Button>
          </ButtonGroup>
        </Box>

        {mocking.mockedUser !== mocking.mockedBy ? (
        <Box data-cy="mockbar">
          <Typography>Logged in as: {user.firstname} {user.lastname}</Typography>
          
          <ButtonGroup className={classes.mockingControls}>
            <Button
              onClick={() => stopMocking(setMocking, mocking.mockedBy)}
              data-cy="stop-mocking-button"
            >
              Switch back to Admin
            </Button>
          </ButtonGroup>
        </Box>) : null}

      </Toolbar>
    </AppBar>
  );
};
