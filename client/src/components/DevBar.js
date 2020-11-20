import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import axios from 'axios';
import { useStore } from 'react-hookstore';

const switchUser = async (setMocking, id) => {
  setMocking(prev => ({ ...prev, mockedUser: id }));
  //window.location.reload();
};

const apiUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.PUBLIC_URL;

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

  return (
    <Menu className="mainHeader" size="massive" stackable borderless attached inverted>
      <Menu.Item>DEV</Menu.Item>
      <Menu.Item onClick={() => switchUser(setMocking, 1)} data-cy="switch-to-student">
        Student
      </Menu.Item>
      <Menu.Item onClick={() => switchUser(setMocking, 2)} data-cy="switch-to-staff">
        Staff
      </Menu.Item>
      <Menu.Item onClick={() => switchUser(setMocking, 3)} data-cy="switch-to-admin">
        Admin
      </Menu.Item>
      <Menu.Item>
        <Icon name="cogs" style={{ color: '#fbbd08' }} />
      </Menu.Item>
        <Menu.Item onClick={resetDatabase}>Empty DB</Menu.Item>
        <Menu.Item onClick={seedDatabase}>Seed DB</Menu.Item>
        <Menu.Item onClick={seedDemoDatabase}>Demo DB</Menu.Item>
      </Menu>
)};
