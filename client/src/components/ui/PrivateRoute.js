/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Message, Icon, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { AppContext } from '../../App';

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

  const { user } = useContext(AppContext);

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
