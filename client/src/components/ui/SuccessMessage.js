import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

export default ({ children }) => (
  <Message icon positive>
    <Icon name="check circle outline" />
    <Message.Content>
      <Message.Header>{children}</Message.Header>
    </Message.Content>
  </Message>
);
