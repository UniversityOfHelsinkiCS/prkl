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
  mockedBy: '',
  mockedUser: null,
});

const Asd = () => {
  const [mocking, setMocking] = useStore('mocking');

  useEffect(() => {
    (async () => {
      const { data: mockedBy } = await axios.get(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/mockedBy'
          : `${process.env.PUBLIC_URL}/mockedBy`
      );

      setMocking(prev => ({ ...prev, mockedBy }));
      // TODO: Fire currentUser query to get mocking status from backend (SSoT).
      // If mockedBy === mockedUser => mockaus ei päällä.
    })();
  }, []);

  const mockingHeader = process.env.NODE_ENV === 'development' ? mocking.mockedUser || '3' : null;

  const apolloClient = new ApolloClient({
    uri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/graphql/'
        : `${process.env.PUBLIC_URL}/graphql/`,
    headers: {
      'x-admin-logged-in-as': mockingHeader,
    },
  });

  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <IntlProvider locale="en" messages={messages.en}>
    <Asd />
  </IntlProvider>,
  document.getElementById('root')
);
