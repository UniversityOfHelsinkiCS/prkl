import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { IntlProvider } from 'react-intl';
import App from './App';
import messages from './localisation/messages';
import { useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';

createStore('mocking', {
  mockedBy: null,
  mockedUser: null,
});

const MockingEnabledClient = () => {
  const [mocking, setMocking] = useStore('mocking');

  console.log('process.env.REACT_APP_CUSTOM_NODE_ENV:', process.env.REACT_APP_CUSTOM_NODE_ENV)

  useEffect(() => {
    (async () => {
      const { data: mock } = await axios.get(
        process.env.REACT_APP_CUSTOM_NODE_ENV === 'development'
          ? 'http://localhost:3001/mocking'
          : `${process.env.PUBLIC_URL}/mocking`
      );
      setMocking(mock); // If mockedBy === mockedUser => mockaus ei päällä.
    })();
  }, []);

  const mockingHeader = process.env.REACT_APP_CUSTOM_NODE_ENV !== 'production'
    ? mocking.mockedUser
    : null;

  const apolloClient = new ApolloClient({
    uri:
      process.env.REACT_APP_CUSTOM_NODE_ENV === 'development'
        ? 'http://localhost:3001/graphql/'
        : `${process.env.PUBLIC_URL}/graphql/`,
    headers: {
      'x-admin-logged-in-as': mockingHeader,
    },
  });

  if (!mocking.mockedUser) {
    return (
      <></>
    )
  }
  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <IntlProvider locale="en" messages={messages.en}>
    <MockingEnabledClient />
  </IntlProvider>,
  document.getElementById('root')
);
