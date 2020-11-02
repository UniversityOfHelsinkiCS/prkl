import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

export default ({ children, iconVar='check circle outline' }) => (
  <Message icon positive>
    <Icon name={iconVar} />
    <Message.Content>
      <Message.Header>{children}</Message.Header>
    </Message.Content>
  </Message>
);
