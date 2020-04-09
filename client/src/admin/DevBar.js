import React from 'react';
import { Menu } from 'semantic-ui-react';
import { setMockHeaders } from '../util/mockHeaders';

const switchUser = async index => {
  setMockHeaders(index);
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
