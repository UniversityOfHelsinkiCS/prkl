/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useStore } from 'react-hookstore';
import { Message, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const NotAllowed = () => (
  <Message icon negative>
    <Icon name="ban" />
    <Message.Content>
      <Message.Header>
        <FormattedMessage id="util.notAllowed" />
      </Message.Header>
    </Message.Content>
  </Message>
);

// prettier-ignore
/**
 * Renders the given function only if user has the correct role.
 *
 * @component
 */
const PrivateRoute = ({ requiredRole, render, ...rest }) => {
  const [user] = useStore('userStore');

  return (
    <Route
      {...rest}
      render={user.role >= requiredRole ? () => render() : () => (<NotAllowed />)}
    />
);}

PrivateRoute.propTypes = {
  /**
   * Minimum role required to render.
   */
  requiredRole: PropTypes.number.isRequired,
  /**
   * The function to render if role check passes.
   */
  render: PropTypes.func.isRequired,
};

export default PrivateRoute;
