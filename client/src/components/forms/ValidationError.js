import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

export default ({ children, errors }) =>
  Object.keys(errors).length !== 0 ? (
    <Message icon negative>
      <Icon name="warning sign" />
      <Message.Content>
        <Message.Header>{children}</Message.Header>
      </Message.Content>
    </Message>
  ) : null;
