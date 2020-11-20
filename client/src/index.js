import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { IntlProvider } from 'react-intl';
import App from './App';
import messages from './localisation/messages';

const apolloClient = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/graphql/'
      : `${process.env.PUBLIC_URL}/graphql/`,
  headers: {
    'x-admin-logged-in-as': localStorage.getItem('mockedId')
  },
});

ReactDOM.render(
  <IntlProvider locale="en" messages={messages.en}>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </IntlProvider>,
  document.getElementById('root')
);
