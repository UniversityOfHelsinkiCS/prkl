import React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';

const stopMocking = async (setMocking, mockedBy) => {
	setMocking(prev => ({ ...prev, mockedUser: mockedBy }));
	window.location.reload();
};

export default () => {
  const [mocking, setMocking] = useStore('mocking');
	const [user] = useStore('userStore');

  return (
    <Menu data-cy="mockbar" className="mainHeader" size="massive" stackable borderless attached inverted>
      <Menu.Item>
        Hey admin, you are now logged in as user:
      </Menu.Item>
			<Menu.Item>
				{user.firstname} {user.lastname}
			</Menu.Item>
      <Menu.Item>
				<Button color="red" onClick={() => stopMocking(setMocking, mocking.mockedBy)} data-cy="stop-mocking-button">
        	Stop
				</Button>
      </Menu.Item>
      </Menu>
)};
