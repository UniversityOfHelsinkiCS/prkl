import React, { useEffect } from 'react';
import { createStore, useStore } from 'react-hookstore';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';
import axios from 'axios';

import App from './App';
import messages from './localisation/messages';
import './index.css';

createStore('mocking', {
  mockedBy: null,
  mockedUser: null,
});

const MockingEnabledClient = () => {
  const [mocking, setMocking] = useStore('mocking');

  useEffect(() => {
    (async () => {
      const { data: mock } = await axios.get(
        process.env.REACT_APP_CUSTOM_NODE_ENV === 'development'
          ? 'http://localhost:3001/mocking'
          : `${process.env.PUBLIC_URL}/mocking`
      );
      setMocking(mock); // If mockedBy === mockedUser => mockaus ei päällä.
    })();
  }, []); // eslint-disable-line

  const mockingHeader = mocking.mockedUser;

  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({
    uri:
      process.env.REACT_APP_CUSTOM_NODE_ENV === 'development'
        ? 'http://localhost:3001/graphql/'
        : `${process.env.PUBLIC_URL}/graphql/`,
    headers: {
      'x-admin-logged-in-as': mockingHeader,
    },
    cache,
    connectToDevTools: true
  });

  if (!mocking.mockedUser) {
    return <></>;
  }
  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <IntlProvider locale="fi" messages={messages.en}>
    <MockingEnabledClient />
  </IntlProvider>,
  document.getElementById('root')
);
