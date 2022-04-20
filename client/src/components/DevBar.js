import React from 'react';
import axios from 'axios';
import { useStore } from 'react-hookstore';
import { AppBar, Button, ButtonGroup, Toolbar, Typography, Box } from '@material-ui/core';
import { useDevBarStyles } from '../styles/ui/DevBar';

const apiUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.PUBLIC_URL;

const switchUser = (setMocking, mockedBy, id) => {
  setMocking(() => ({ mockedBy, mockedUser: id }));
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
  const classes = useDevBarStyles();

  return (
    <AppBar className={classes.appbar} position="static">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Devbar
        </Typography>
        <Box>
          <Typography>Log in as...</Typography>
          <ButtonGroup className={classes.roleControls}>
            <Button
              onClick={() => switchUser(setMocking, mocking.mockedBy, 1)}
              data-cy="switch-to-student"
            >
              Student
            </Button>
            <Button
              onClick={() => switchUser(setMocking, mocking.mockedBy, 2)}
              data-cy="switch-to-staff"
            >
              Staff
            </Button>
            <Button
              onClick={() => switchUser(setMocking, mocking.mockedBy, mocking.mockedBy)}
              data-cy="switch-to-admin"
            >
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
      </Toolbar>
    </AppBar>
  );
};
