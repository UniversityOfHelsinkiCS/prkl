import React, { useState } from 'react';

import { Menu } from 'semantic-ui-react';

import { useStore } from 'react-hookstore';

const DevBar = () => {
  const [user, setUser] = useStore('userStore');
  const student = {
    uid: '123-123',
    firstname: 'student',
    email: 'student@email',
    studentNo: '123456789',
    lastname: 'Lastname',
    role: 1,
    registrations: [{ course: { id: '1' } }],
  };
  const staff = {
    uid: '456-456',
    firstname: 'staffer',
    email: 'staff@email',
    studentNo: '987654321',
    lastname: 'Lastname',
    role: 2,
    registrations: [{ course: { id: '1' } }],
  };
  const admin = {
    uid: '789-789',
    firstname: 'adminer',
    email: 'admin@email',
    studentNo: '133742069',
    lastname: 'Lastname',
    role: 3,
    registrations: [{ course: { id: '1' } }],
  };

  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    console.log('name:', name);
    switch (name) {
      case 'admin':
        setUser(admin);
        break;
      case 'staff':
        setUser(staff);
        break;
      case 'student':
        setUser(student);
        break;
      default:
        console.log('invalid user');
    }
  };
  return (
    <Menu
      className="mainHeader"
      size="massive"
      stackable
      borderless
      attached
      inverted
    >
      <Menu.Item name="Home" active={activeItem === 'Home'}>
        DEV
      </Menu.Item>

      <Menu.Item
        name="student"
        active={activeItem === 'student'}
        onClick={handleItemClick}
      >
        Student
      </Menu.Item>

      <Menu.Item
        name="staff"
        active={activeItem === 'staff'}
        onClick={handleItemClick}
      >
        Staff
      </Menu.Item>
      <Menu.Item
        name="admin"
        active={activeItem === 'admin'}
        onClick={handleItemClick}
      >
        Admin
      </Menu.Item>
    </Menu>
  );
};

export default DevBar;
