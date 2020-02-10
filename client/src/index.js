import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import ApolloClient, { gql } from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import { IntlProvider } from "react-intl"
import messages from "./localisation/messages"

const typeDefs = gql`
  type data {
    title: String!
    code: String!
    description: String!
  }
`

const apolloClient = new ApolloClient({
  uri:
    process.env.NODE_ENV === "development"
      ? `http://localhost:3001/graphql/`
      : `/assembler/graphql/`
})

ReactDOM.render(
  <IntlProvider locale={"en"} messages={messages["en"]}>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </IntlProvider>,
  document.getElementById("root")
)
