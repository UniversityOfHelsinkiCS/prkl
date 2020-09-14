import React, { useState } from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import roles from '../util/user_roles';
import axios from 'axios';

export default () => {
  const [activeItem, setActiveItem] = useState(null);
  const [user] = useStore('userStore');
  const [privacyToggle, setPrivacyToggle] = useStore('toggleStore');

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const handleLogout = () => {
    const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/logout' : '/logout';

    axios.get(url).then(function(result) {
      localStorage.clear();
      window.location.replace(result.data);
    })
  };

  return (
    <Menu className="mainHeader" size="massive" stackable borderless attached>
      <Menu.Item header as={Link} to="/" name="Home" active={activeItem === 'Home'}>
        Assembler
      </Menu.Item>

      <Menu.Item
        as={Link}
        to="/courses"
        name="Courses"
        active={activeItem === 'Courses'}
        onClick={handleItemClick}
        data-cy="menu-item-courses"
      >
        <FormattedMessage id="header.courses" />
      </Menu.Item>

      {user && user.role >= roles.STAFF_ROLE ? (
        <Menu.Item
          as={Link}
          to="/addcourse"
          name="AddCourse"
          active={activeItem === 'AddCourse'}
          onClick={handleItemClick}
          data-cy="menu-item-add-course"
        >
          <FormattedMessage id="header.addCourse" />
        </Menu.Item>
      ) : null}

      {user && user.role === roles.ADMIN_ROLE ? (
        <Menu.Item
          as={Link}
          to="/usermanagement"
          name="Users"
          active={activeItem === 'Users'}
          onClick={handleItemClick}
          data-cy="menu-item-user-mgmt"
        >
          <FormattedMessage id="header.userManagement" />
        </Menu.Item>
      ) : null}

      <Menu.Item
        as={Link}
        to="/user"
        name="personalInfo"
        active={activeItem === 'personalInfo'}
        onClick={handleItemClick}
        data-cy="menu-item-info"
      >        
        <FormattedMessage id="header.personalInfo" />
      </Menu.Item>

      {user && user.role > roles.STAFF_ROLE ? (
        <Menu.Item position="right" data-cy="menu-item-privacy-toggle">
          <Button onClick={() => setPrivacyToggle(!privacyToggle)}>
            <FormattedMessage id="header.toggle" />
          </Button>
        </Menu.Item>
      ) : null}
    
      <Menu.Item
        name="logout"
        active={activeItem === 'logout'}
        onClick={handleLogout}
        position="right"
        data-cy="menu-item-logout"
      >
        <FormattedMessage id="header.logout" />
      </Menu.Item>
    </Menu>
  );
};
