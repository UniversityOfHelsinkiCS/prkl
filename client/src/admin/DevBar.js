import React from 'react';
import { Menu } from 'semantic-ui-react';
import axios from 'axios';

const switchUser = async index => {
  await axios.post('http://localhost:3001/switchUser', { index });
  window.location.reload();
};

export default () => (
  <Menu className="mainHeader" size="massive" stackable borderless attached inverted>
    <Menu.Item>DEV</Menu.Item>
    <Menu.Item onClick={() => switchUser(0)}>Student</Menu.Item>
    <Menu.Item onClick={() => switchUser(1)}>Staff</Menu.Item>
    <Menu.Item onClick={() => switchUser(2)}>Admin</Menu.Item>
  </Menu>
);
