import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { IntlProvider } from 'react-intl';
import App from './App';
import messages from './localisation/messages';
import { getMockHeaders } from './util/mockHeaders';

const apolloClient = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/graphql/'
      : `${process.env.PUBLIC_URL}/graphql/`,
  headers: process.env.REACT_APP_CUSTOM_NODE_ENV === 'production' ? {} : getMockHeaders(),
});

ReactDOM.render(
  <IntlProvider locale="en" messages={messages.en}>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </IntlProvider>,
  document.getElementById('root')
);
