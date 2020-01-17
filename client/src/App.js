import React from "react"
import Header from "./components/Header"
import StudentInfo from "./components/StudentInfo"
import Question from "./components/Question";
import { Container } from "semantic-ui-react"

import "./App.css"

function App() {
  return (
    <div className="App">
      <Header />
      <div className="mainContent">
        <StudentInfo />
        <Question />
      </div>
    </div>
  )
}

export default App
