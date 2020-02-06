import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import ApolloClient, { gql } from 'apollo-boost'
import { ApolloProvider, ApolloConsumer, Query } from 'react-apollo'
import { IntlProvider } from "react-intl"
import messages from "./localisation/messages"

const env = window.location
const apolloClient = new ApolloClient({
    uri: `${env.protocol}${env.hostname}:4000`
})

const ALL_COURSES = gql`
{
  courses{
    id,
    title,
    code,
    description
  }
}
`

const ADD_COURSE = gql`
{
  course{
    id,
    title,
    code,
    description
  }
}
`

const ProgramNest = () => {

    return (
        <IntlProvider locale={"en"} messages={messages["en"]}>
            <ApolloProvider>
                <ApolloConsumer>
                    {(client =>
                        <Query query={ALL_COURSES}>
                            {(result => {
                                if (result.loading) {
                                    return <div>loading...</div>
                                }
                                return (
                                    <App result={result} client={client} />
                                )
                            })}
                        </Query>
                    )}
                </ApolloConsumer>
            </ApolloProvider>
        </IntlProvider>
    )
}

export default ProgramNest