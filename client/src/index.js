import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { IntlProvider } from "react-intl"
import messages from "./localisation/messages"

ReactDOM.render(
  <IntlProvider locale={"en"} messages={messages["en"]}>
    <App />
  </IntlProvider>,
  document.getElementById("root")
)
