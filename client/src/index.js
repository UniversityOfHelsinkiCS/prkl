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

const Asd = () => {
  const [mocking, setMocking] = useStore('mocking');

  useEffect(() => {
    (async () => {
      const { data: mock } = await axios.get(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/mocking'
          : `${process.env.PUBLIC_URL}/mocking`
      );
      setMocking(mock);
      // If mockedBy === mockedUser => mockaus ei päällä.
    })();
  }, []);

  const mockingHeader = process.env.NODE_ENV === 'development' ? mocking.mockedUser : null;

  const apolloClient = new ApolloClient({
    uri:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/graphql/'
        : `${process.env.PUBLIC_URL}/graphql/`,
    headers: {
      'x-admin-logged-in-as': mockingHeader,
    },
  });

  if(mocking.mockedUser === null) {
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
    <Asd />
  </IntlProvider>,
  document.getElementById('root')
);
