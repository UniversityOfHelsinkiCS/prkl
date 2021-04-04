import React, { useContext } from 'react';
import { Menu, Button, Loader } from 'semantic-ui-react';
import { useStore } from 'react-hookstore';
import { AppContext } from '../App';


export default () => {
  const [mocking, setMocking] = useStore('mocking');
  const { user } = useContext(AppContext);

  const stopMocking = async (setMocking, mockedBy) => {
    setMocking(prev => ({ ...prev, mockedUser: mockedBy }));
    window.location.reload();
  };

  return (
    <>
      {mocking.mockedUser !== mocking.mockedBy ? (
        <Menu
          data-cy="mockbar"
          className="mainHeader"
          size="massive"
          stackable
          borderless
          attached
          inverted
        >
          <Menu.Item>Hey admin, you are now logged in as user:</Menu.Item>
          <Menu.Item>
            {user.firstname} {user.lastname}
          </Menu.Item>
          <Menu.Item>
            <Button
              color="red"
              onClick={() => stopMocking(setMocking, mocking.mockedBy)}
              data-cy="stop-mocking-button"
            >
              Stop
            </Button>
          </Menu.Item>
        </Menu>
      ) : null}
    </>
  );
};
