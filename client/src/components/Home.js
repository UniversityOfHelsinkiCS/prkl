import React from "react"
import { FormattedMessage, useIntl } from "react-intl"


const Home = () => {


    const intl = useIntl()


    return (
        <div className="mainContent">
            <h1 style={
                { animation: "spin 8s linear infinite" }
            }>
                {intl.formatMessage({
                    id: "home.welcome"
                })}
            </h1>

            <FormattedMessage id="home.briefing"></FormattedMessage>
        </div>
    )
}

export default Home